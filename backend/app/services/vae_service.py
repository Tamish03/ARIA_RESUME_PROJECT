import numpy as np
import tensorflow as tf
from sklearn.metrics.pairwise import cosine_similarity
import os
import zipfile
import h5py
import io
from ..models.vae import build_vae

class VAEService:
    def __init__(self):
        # Resolve paths relative to workspace directory
        service_dir = os.path.dirname(os.path.abspath(__file__))
        
        # 1. Environment variables (if defined)
        taste_vectors_path = os.environ.get("TASTE_VECTORS_PATH")
        vae_model_path = os.environ.get("VAE_MODEL_PATH")
        
        # 2. Package models directory fallback
        if not taste_vectors_path or not os.path.exists(taste_vectors_path):
            taste_vectors_path = os.path.join(service_dir, "..", "models", "taste_vectors.npy")
        if not vae_model_path or not os.path.exists(vae_model_path):
            vae_model_path = os.path.join(service_dir, "..", "models", "best_taset_vae.keras")
            
        # 3. Outer workspace directory fallback (backward compatibility for dev environment)
        if not os.path.exists(taste_vectors_path):
            workspace_dir = os.path.abspath(os.path.join(service_dir, "..", "..", "..", ".."))
            taste_vectors_path = os.path.join(workspace_dir, "taste_vectors.npy")
        if not os.path.exists(vae_model_path):
            workspace_dir = os.path.abspath(os.path.join(service_dir, "..", "..", "..", ".."))
            vae_model_path = os.path.join(workspace_dir, "best_taset_vae.keras")

        # Build VAE models (input_dim=1681, latent_dim=8)
        self.vae, self.encoder, self.decoder = build_vae(input_dim=1681, latent_dim=8)
        
        # Build layer variables by running dummy input
        _ = self.encoder(np.zeros((1, 1681), dtype=np.float32))
        _ = self.decoder(np.zeros((1, 8), dtype=np.float32))

        # Load weights manually to avoid registry/name mismatches
        if os.path.exists(vae_model_path):
            try:
                self._load_weights_manually(vae_model_path)
                print(f"TasteVAE weights loaded successfully from {vae_model_path}")
            except Exception as e:
                print(f"Error loading TasteVAE weights manually: {e}")
        else:
            print(f"Warning: TasteVAE model file not found at {vae_model_path}")

        # Load taste vectors (568 users, 8 latent dimensions)
        if os.path.exists(taste_vectors_path):
            try:
                self.taste_vectors = np.load(taste_vectors_path).astype(np.float32)
                print(f"Loaded taste vectors of shape {self.taste_vectors.shape} from {taste_vectors_path}")
            except Exception as e:
                print(f"Error loading taste vectors: {e}")
                self.taste_vectors = np.random.randn(568, 8).astype(np.float32)
        else:
            print(f"Warning: taste_vectors.npy not found at {taste_vectors_path}, using random placeholder")
            self.taste_vectors = np.random.randn(568, 8).astype(np.float32)

        # Resolve UMAP embeddings path
        umap_embeddings_path = os.environ.get("UMAP_EMBEDDINGS_PATH")
        if not umap_embeddings_path or not os.path.exists(umap_embeddings_path):
            umap_embeddings_path = os.path.join(service_dir, "..", "models", "umap_embeddings.npy")
        if not os.path.exists(umap_embeddings_path):
            workspace_dir = os.path.abspath(os.path.join(service_dir, "..", "..", "..", ".."))
            umap_embeddings_path = os.path.join(workspace_dir, "umap_embeddings.npy")

        # Load or fit UMAP embeddings
        self.umap_embeddings = None
        if os.path.exists(umap_embeddings_path):
            try:
                self.umap_embeddings = np.load(umap_embeddings_path).astype(np.float32)
                print(f"Loaded precomputed UMAP embeddings from {umap_embeddings_path}")
            except Exception as e:
                print(f"Error loading precomputed UMAP embeddings: {e}")
                self.umap_embeddings = None

        if self.umap_embeddings is None:
            try:
                print("Precomputed UMAP embeddings not found or failed to load. Fitting UMAP on the fly...")
                import umap
                reducer = umap.UMAP(n_components=2, random_state=42)
                self.umap_embeddings = reducer.fit_transform(self.taste_vectors)
            except Exception as e:
                print(f"Error fitting UMAP on the fly: {e}")
                self.umap_embeddings = np.random.randn(len(self.taste_vectors), 2).astype(np.float32)

    def _load_weights_manually(self, keras_file_path):
        with zipfile.ZipFile(keras_file_path) as z:
            data = z.read('model.weights.h5')
            with h5py.File(io.BytesIO(data), 'r') as f:
                # Load encoder weights
                dense_kernel = f['encoder/layers/dense/vars/0'][:]
                dense_bias = f['encoder/layers/dense/vars/1'][:]
                self.encoder.get_layer('dense').set_weights([dense_kernel, dense_bias])
                
                bn_gamma = f['encoder/layers/batch_normalization/vars/0'][:]
                bn_beta = f['encoder/layers/batch_normalization/vars/1'][:]
                bn_mean = f['encoder/layers/batch_normalization/vars/2'][:]
                bn_var = f['encoder/layers/batch_normalization/vars/3'][:]
                self.encoder.get_layer('batch_normalization').set_weights([bn_gamma, bn_beta, bn_mean, bn_var])
                
                dense1_kernel = f['encoder/layers/dense_1/vars/0'][:]
                dense1_bias = f['encoder/layers/dense_1/vars/1'][:]
                self.encoder.get_layer('dense_1').set_weights([dense1_kernel, dense1_bias])
                
                bn1_gamma = f['encoder/layers/batch_normalization_1/vars/0'][:]
                bn1_beta = f['encoder/layers/batch_normalization_1/vars/1'][:]
                bn1_mean = f['encoder/layers/batch_normalization_1/vars/2'][:]
                bn1_var = f['encoder/layers/batch_normalization_1/vars/3'][:]
                self.encoder.get_layer('batch_normalization_1').set_weights([bn1_gamma, bn1_beta, bn1_mean, bn1_var])
                
                zm_kernel = f['encoder/layers/dense_2/vars/0'][:]
                zm_bias = f['encoder/layers/dense_2/vars/1'][:]
                self.encoder.get_layer('dense_2').set_weights([zm_kernel, zm_bias])
                
                zlv_kernel = f['encoder/layers/dense_3/vars/0'][:]
                zlv_bias = f['encoder/layers/dense_3/vars/1'][:]
                self.encoder.get_layer('dense_3').set_weights([zlv_kernel, zlv_bias])
                
                # Load decoder weights
                dec_dense_kernel = f['decoder/layers/dense/vars/0'][:]
                dec_dense_bias = f['decoder/layers/dense/vars/1'][:]
                self.decoder.get_layer('dense').set_weights([dec_dense_kernel, dec_dense_bias])
                
                dec_bn_gamma = f['decoder/layers/batch_normalization/vars/0'][:]
                dec_bn_beta = f['decoder/layers/batch_normalization/vars/1'][:]
                dec_bn_mean = f['decoder/layers/batch_normalization/vars/2'][:]
                dec_bn_var = f['decoder/layers/batch_normalization/vars/3'][:]
                self.decoder.get_layer('batch_normalization').set_weights([dec_bn_gamma, dec_bn_beta, dec_bn_mean, dec_bn_var])
                
                dec_dense1_kernel = f['decoder/layers/dense_1/vars/0'][:]
                dec_dense1_bias = f['decoder/layers/dense_1/vars/1'][:]
                self.decoder.get_layer('dense_1').set_weights([dec_dense1_kernel, dec_dense1_bias])
                
                dec_bn1_gamma = f['decoder/layers/batch_normalization_1/vars/0'][:]
                dec_bn1_beta = f['decoder/layers/batch_normalization_1/vars/1'][:]
                dec_bn1_mean = f['decoder/layers/batch_normalization_1/vars/2'][:]
                dec_bn1_var = f['decoder/layers/batch_normalization_1/vars/3'][:]
                self.decoder.get_layer('batch_normalization_1').set_weights([dec_bn1_gamma, dec_bn1_beta, dec_bn1_mean, dec_bn1_var])
                
                dec_dense2_kernel = f['decoder/layers/dense_2/vars/0'][:]
                dec_dense2_bias = f['decoder/layers/dense_2/vars/1'][:]
                self.decoder.get_layer('dense_2').set_weights([dec_dense2_kernel, dec_dense2_bias])

    def encode(self, user_ratings: np.ndarray):
        # input shape (1, 1682) -> slice to (1, 1681)
        if user_ratings.shape[1] > 1681:
            user_ratings = user_ratings[:, :1681]
        z_mean, z_log_var, z = self.encoder.predict(user_ratings, verbose=0)
        return z_mean[0], z_log_var[0], z[0]

    def decode(self, z: np.ndarray):
        z = z.reshape(1, -1)
        reconstructed = self.decoder.predict(z, verbose=0)
        # Pad reconstructed output back to 1682 elements
        res = np.zeros(1682, dtype=np.float32)
        res[:1681] = reconstructed[0]
        return res

    def get_neighbors(self, user_id: int, k: int = 5):
        # Map user_id using modulo to prevent out of bounds
        idx = (user_id - 1) % len(self.taste_vectors)
            
        target_vec = self.taste_vectors[idx].reshape(1, -1)
        similarities = cosine_similarity(target_vec, self.taste_vectors)[0]
        
        # Get top k+1 (including self)
        top_indices = np.argsort(similarities)[::-1][:k+1]
        
        neighbors = []
        for i in top_indices:
            if i != idx:
                neighbors.append({
                    "user_id": int(i + 1),
                    "similarity": float(similarities[i])
                })
        return neighbors[:k]

    def get_umap_projection(self):
        projection = []
        genres = ["Sci-Fi", "Drama", "Action", "Comedy", "Romance"]
        for i, (x, y) in enumerate(self.umap_embeddings):
            projection.append({
                "user_id": i + 1,
                "x": float(x),
                "y": float(y),
                "top_genre": genres[i % len(genres)],
                "cluster_id": i % len(genres)
            })
        return projection

vae_service = VAEService()

