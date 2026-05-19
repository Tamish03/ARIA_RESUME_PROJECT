import tensorflow as tf
from tensorflow.keras import layers, Model

def build_classifier(input_dim=20, lr=0.00123, dropout_rate=0.22, h1=256, h2=64, l2_reg=1e-5):
    inputs = tf.keras.Input(shape=(input_dim,))
    x = layers.Dense(h1, activation="relu", kernel_regularizer=tf.keras.regularizers.l2(l2_reg))(inputs)
    x = layers.Dropout(dropout_rate)(x)
    x = layers.Dense(h2, activation="relu", kernel_regularizer=tf.keras.regularizers.l2(l2_reg))(x)
    outputs = layers.Dense(1, activation="sigmoid")(x)
    
    model = Model(inputs, outputs, name="engagement_classifier")
    
    optimizer = tf.keras.optimizers.Adam(learning_rate=lr)
    model.compile(optimizer=optimizer, loss="binary_crossentropy", metrics=["AUC"])
    
    return model
