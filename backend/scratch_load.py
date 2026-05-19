import tensorflow as tf
import keras
from keras import layers
import numpy as np
import zipfile
import h5py
import io

@keras.saving.register_keras_serializable(name="Sampling")
class Sampling(layers.Layer):
    def call(self, inputs):
        z_mean, z_log_var = inputs
        eps = tf.random.normal(shape=tf.shape(z_mean))
        return z_mean + tf.exp(0.5 * z_log_var) * eps

# Build encoder with exact names
enc_in = keras.Input(shape=(1681,), name='input_layer')
x = layers.Dense(512, name='dense')(enc_in)
x = layers.BatchNormalization(name='batch_normalization')(x)
x = layers.ReLU(name='re_lu')(x)
x = layers.Dropout(0.2, name='dropout')(x)
x = layers.Dense(256, name='dense_1')(x)
x = layers.BatchNormalization(name='batch_normalization_1')(x)
x = layers.ReLU(name='re_lu_1')(x)
x = layers.Dropout(0.2, name='dropout_1')(x)
zm  = layers.Dense(8, name='dense_2')(x)
zlv = layers.Dense(8, name='dense_3')(x)
z   = Sampling(name='sampling')([zm, zlv])
encoder = keras.Model(enc_in, [zm, zlv, z], name='encoder')

# Build decoder with exact names
dec_in = keras.Input(shape=(8,), name='input_layer')
x = layers.Dense(256, name='dense')(dec_in)
x = layers.BatchNormalization(name='batch_normalization')(x)
x = layers.ReLU(name='re_lu')(x)
x = layers.Dropout(0.2, name='dropout')(x)
x = layers.Dense(512, name='dense_1')(x)
x = layers.BatchNormalization(name='batch_normalization_1')(x)
x = layers.ReLU(name='re_lu_1')(x)
x = layers.Dropout(0.2, name='dropout_1')(x)
dec_out = layers.Dense(1681, activation='sigmoid', name='dense_2')(x)
decoder = keras.Model(dec_in, dec_out, name='decoder')


def load_vae_weights_manually(keras_file_path, encoder, decoder):
    with zipfile.ZipFile(keras_file_path) as z:
        data = z.read('model.weights.h5')
        with h5py.File(io.BytesIO(data), 'r') as f:
            # Load encoder weights
            dense_kernel = f['encoder/layers/dense/vars/0'][:]
            dense_bias = f['encoder/layers/dense/vars/1'][:]
            encoder.get_layer('dense').set_weights([dense_kernel, dense_bias])
            
            bn_gamma = f['encoder/layers/batch_normalization/vars/0'][:]
            bn_beta = f['encoder/layers/batch_normalization/vars/1'][:]
            bn_mean = f['encoder/layers/batch_normalization/vars/2'][:]
            bn_var = f['encoder/layers/batch_normalization/vars/3'][:]
            encoder.get_layer('batch_normalization').set_weights([bn_gamma, bn_beta, bn_mean, bn_var])
            
            dense1_kernel = f['encoder/layers/dense_1/vars/0'][:]
            dense1_bias = f['encoder/layers/dense_1/vars/1'][:]
            encoder.get_layer('dense_1').set_weights([dense1_kernel, dense1_bias])
            
            bn1_gamma = f['encoder/layers/batch_normalization_1/vars/0'][:]
            bn1_beta = f['encoder/layers/batch_normalization_1/vars/1'][:]
            bn1_mean = f['encoder/layers/batch_normalization_1/vars/2'][:]
            bn1_var = f['encoder/layers/batch_normalization_1/vars/3'][:]
            encoder.get_layer('batch_normalization_1').set_weights([bn1_gamma, bn1_beta, bn1_mean, bn1_var])
            
            zm_kernel = f['encoder/layers/dense_2/vars/0'][:]
            zm_bias = f['encoder/layers/dense_2/vars/1'][:]
            encoder.get_layer('dense_2').set_weights([zm_kernel, zm_bias])
            
            zlv_kernel = f['encoder/layers/dense_3/vars/0'][:]
            zlv_bias = f['encoder/layers/dense_3/vars/1'][:]
            encoder.get_layer('dense_3').set_weights([zlv_kernel, zlv_bias])
            
            # Load decoder weights
            dec_dense_kernel = f['decoder/layers/dense/vars/0'][:]
            dec_dense_bias = f['decoder/layers/dense/vars/1'][:]
            decoder.get_layer('dense').set_weights([dec_dense_kernel, dec_dense_bias])
            
            dec_bn_gamma = f['decoder/layers/batch_normalization/vars/0'][:]
            dec_bn_beta = f['decoder/layers/batch_normalization/vars/1'][:]
            dec_bn_mean = f['decoder/layers/batch_normalization/vars/2'][:]
            dec_bn_var = f['decoder/layers/batch_normalization/vars/3'][:]
            decoder.get_layer('batch_normalization').set_weights([dec_bn_gamma, dec_bn_beta, dec_bn_mean, dec_bn_var])
            
            dec_dense1_kernel = f['decoder/layers/dense_1/vars/0'][:]
            dec_dense1_bias = f['decoder/layers/dense_1/vars/1'][:]
            decoder.get_layer('dense_1').set_weights([dec_dense1_kernel, dec_dense1_bias])
            
            dec_bn1_gamma = f['decoder/layers/batch_normalization_1/vars/0'][:]
            dec_bn1_beta = f['decoder/layers/batch_normalization_1/vars/1'][:]
            dec_bn1_mean = f['decoder/layers/batch_normalization_1/vars/2'][:]
            dec_bn1_var = f['decoder/layers/batch_normalization_1/vars/3'][:]
            decoder.get_layer('batch_normalization_1').set_weights([dec_bn1_gamma, dec_bn1_beta, dec_bn1_mean, dec_bn1_var])
            
            dec_dense2_kernel = f['decoder/layers/dense_2/vars/0'][:]
            dec_dense2_bias = f['decoder/layers/dense_2/vars/1'][:]
            decoder.get_layer('dense_2').set_weights([dec_dense2_kernel, dec_dense2_bias])

try:
    print("Testing manual VAE weights loading...")
    _ = encoder(np.zeros((1, 1681), dtype=np.float32))
    _ = decoder(np.zeros((1, 8), dtype=np.float32))
    load_vae_weights_manually('../../best_taset_vae.keras', encoder, decoder)
    print("Manual VAE weights loaded successfully!")
    
    print("\nTesting end-to-end forward pass...")
    taste = encoder.predict(np.ones((1, 1681), dtype=np.float32))
    z_mean_val = taste[0]
    recon = decoder.predict(z_mean_val)
    print("Latent representation z_mean (first 5 elements):", z_mean_val[0][:5])
    print("Reconstructed shape:", recon.shape)
except Exception as e:
    print("Failed to load VAE weights manually:", e)
