import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [editId, setEditId] = useState(null);

  const storage = getStorage();

  // 🔥 Ambil data produk
  const fetchProducts = async () => {
    const snapshot = await getDocs(collection(db, "products"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProducts(data);
  };

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(data);
    };

    fetchData();
  }, []);

  // 🔥 Upload gambar
  const uploadImage = async () => {
    if (!image) return "";

    const imageRef = ref(storage, `products/${Date.now()}-${image.name}`);
    await uploadBytes(imageRef, image);
    return await getDownloadURL(imageRef);
  };

  // 🔥 Tambah / Edit produk
  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = "";

    if (image) {
      imageUrl = await uploadImage();
    }

    if (editId) {
      await updateDoc(doc(db, "products", editId), {
        name,
        price: Number(price),
        ...(imageUrl && { imageUrl }),
      });
    } else {
      await addDoc(collection(db, "products"), {
        name,
        price: Number(price),
        imageUrl,
      });
    }

    // reset form
    setName("");
    setPrice("");
    setImage(null);
    setEditId(null);

    fetchProducts();
  };

  // 🔥 Hapus produk
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "products", id));
    fetchProducts();
  };

  // 🔥 Edit produk
  const handleEdit = (product) => {
    setName(product.name);
    setPrice(product.price);
    setEditId(product.id);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Products Management</h1>

      {/* FORM */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <input type="file" onChange={(e) => setImage(e.target.files[0])} />

        <button type="submit">
          {editId ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* LIST PRODUK */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              borderRadius: "10px",
            }}
          >
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.name}
                style={{ width: "100%", height: "150px", objectFit: "cover" }}
              />
            )}

            <h3>{product.name}</h3>
            <p>Rp {product.price.toLocaleString()}</p>

            <button onClick={() => handleEdit(product)}>Edit</button>
            <button onClick={() => handleDelete(product.id)}>Hapus</button>
          </div>
        ))}
      </div>
    </div>
  );
}
