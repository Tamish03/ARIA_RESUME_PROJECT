import tensorflow as tf
from tensorflow.keras import layers, Model
import keras

@keras.saving.register_keras_serializable(name="Sampling")
class Sampling(layers.Layer):
    def call(self, inputs):
        z_mean, z_log_var = inputs
        batch = tf.shape(z_mean)[0]
        dim = tf.shape(z_mean)[1]
        epsilon = tf.keras.backend.random_normal(shape=(batch, dim))
        return z_mean + tf.exp(0.5 * z_log_var) * epsilon

class VAELossLayer(layers.Layer):
    def call(self, inputs):
        x, x_recon, z_mean, z_log_var = inputs
        reconstruction_loss = tf.keras.losses.binary_crossentropy(x, x_recon)
        reconstruction_loss *= 1681
        kl_loss = 1 + z_log_var - tf.square(z_mean) - tf.exp(z_log_var)
        kl_loss = tf.reduce_mean(kl_loss)
        kl_loss *= -0.5
        vae_loss = tf.reduce_mean(reconstruction_loss + kl_loss)
        self.add_loss(vae_loss)
        return x_recon

def build_vae(input_dim=1681, latent_dim=8):
    # Build encoder with exact names matching trained weights
    enc_in = keras.Input(shape=(input_dim,), name='input_layer')
    x = layers.Dense(512, name='dense')(enc_in)
    x = layers.BatchNormalization(name='batch_normalization')(x)
    x = layers.ReLU(name='re_lu')(x)
    x = layers.Dropout(0.2, name='dropout')(x)
    x = layers.Dense(256, name='dense_1')(x)
    x = layers.BatchNormalization(name='batch_normalization_1')(x)
    x = layers.ReLU(name='re_lu_1')(x)
    x = layers.Dropout(0.2, name='dropout_1')(x)
    zm  = layers.Dense(latent_dim, name='dense_2')(x)
    zlv = layers.Dense(latent_dim, name='dense_3')(x)
    z   = Sampling(name='sampling')([zm, zlv])
    encoder = keras.Model(enc_in, [zm, zlv, z], name='encoder')
    
    # Build decoder with exact names matching trained weights
    dec_in = keras.Input(shape=(latent_dim,), name='input_layer')
    x = layers.Dense(256, name='dense')(dec_in)
    x = layers.BatchNormalization(name='batch_normalization')(x)
    x = layers.ReLU(name='re_lu')(x)
    x = layers.Dropout(0.2, name='dropout')(x)
    x = layers.Dense(512, name='dense_1')(x)
    x = layers.BatchNormalization(name='batch_normalization_1')(x)
    x = layers.ReLU(name='re_lu_1')(x)
    x = layers.Dropout(0.2, name='dropout_1')(x)
    dec_out = layers.Dense(input_dim, activation='sigmoid', name='dense_2')(x)
    decoder = keras.Model(dec_in, dec_out, name='decoder')
    
    # Connect encoder and decoder
    z_mean_val, z_log_var_val, z_val = encoder(enc_in)
    reconstructed = decoder(z_val)
    
    # Use loss layer
    vae_outputs = VAELossLayer()([enc_in, reconstructed, z_mean_val, z_log_var_val])
    vae = Model(enc_in, vae_outputs, name="TasteVAE")
    
    return vae, encoder, decoder

