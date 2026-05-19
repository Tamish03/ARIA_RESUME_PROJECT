import tensorflow as tf
from tensorflow.keras import layers, Model
from .vae import Sampling

class DreamVAELossLayer(layers.Layer):
    def call(self, inputs):
        x, x_recon, z_mean, z_log_var = inputs
        reconstruction_loss = tf.reduce_mean(tf.square(x - x_recon), axis=-1)
        reconstruction_loss *= 16
        kl_loss = 1 + z_log_var - tf.square(z_mean) - tf.exp(z_log_var)
        kl_loss = tf.reduce_mean(kl_loss)
        kl_loss *= -0.5
        vae_loss = tf.reduce_mean(reconstruction_loss + kl_loss)
        self.add_loss(vae_loss)
        return x_recon

def build_dream_vae(input_dim=16, latent_dim=8):
    encoder_inputs = tf.keras.Input(shape=(input_dim,))
    x = layers.Dense(64, activation="relu")(encoder_inputs)
    x = layers.Dense(32, activation="relu")(x)
    
    z_mean = layers.Dense(latent_dim, name="z_mean")(x)
    z_log_var = layers.Dense(latent_dim, name="z_log_var")(x)
    z = Sampling()([z_mean, z_log_var])
    
    encoder = Model(encoder_inputs, [z_mean, z_log_var, z], name="dream_encoder")
    
    latent_inputs = tf.keras.Input(shape=(latent_dim,))
    x = layers.Dense(32, activation="relu")(latent_inputs)
    x = layers.Dense(64, activation="relu")(x)
    decoder_outputs = layers.Dense(input_dim, activation="sigmoid")(x)
    
    decoder = Model(latent_inputs, decoder_outputs, name="dream_decoder")
    
    # Connect encoder and decoder
    z_mean_val, z_log_var_val, z_val = encoder(encoder_inputs)
    reconstructed = decoder(z_val)
    
    # Use loss layer
    vae_outputs = DreamVAELossLayer()([encoder_inputs, reconstructed, z_mean_val, z_log_var_val])
    
    vae = Model(encoder_inputs, vae_outputs, name="dream_vae")
    
    return vae, encoder, decoder

def dream_samples(decoder, n_samples=100, latent_dim=8):
    random_latent_vectors = tf.random.normal(shape=(n_samples, latent_dim))
    generated_samples = decoder(random_latent_vectors)
    return generated_samples.numpy()
