import React, { useEffect, useState } from "react";
import "./App.css";

const initialPosts = [
  {
    id: 1,
    title: "The Art of Creative Thinking",
    category: "Lifestyle",
    author: "Sarah Johnson",
    date: "November 15, 2026",
    image: "https://lpsonline.sas.upenn.edu/sites/default/files/2025-07/plpso-feature-neuro-and-creativity.jpg",
    description: "Discover simple ways to improve your creativity and develop new ideas in everyday life.",
    content: "Creativity is not just about art. It is about finding new ways to solve problems, explore ideas and make everyday life more interesting. Start by observing the world around you, reading new books and trying different activities."
  },
  {
    id: 2,
    title: "Technology Trends in 2026",
    category: "Technology",
    author: "David Miller",
    date: "November 12, 2026",
    image: "https://www.mindfiresolutions.com/blog/wp-content/uploads/Top-Technology-Trends.png",
    description: "Explore the latest technology trends changing the modern digital world.",
    content: "Technology continues to transform our daily lives. Artificial intelligence, cloud computing and modern web development are creating exciting opportunities for the future."
  },
  {
    id: 3,
    title: "A Journey Through Nature",
    category: "Travel",
    author: "Emily Wilson",
    date: "November 10, 2026",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7LMSsZj8HQuQdBLNtwMInV7iSlRkyIWL_Mt4nYIOmhw&s",
    description: "Take a refreshing journey through beautiful landscapes and peaceful destinations.",
    content: "Travelling helps us discover new places and cultures. Spending time in nature gives us peace, happiness and unforgettable memories."
  }
];

function App() {
  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem("blogPosts");
    return saved ? JSON.parse(saved) : initialPosts;
  });

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    category: "Technology",
    author: "",
    image: "",
    description: "",
    content: ""
  });

  useEffect(() => {
    localStorage.setItem("blogPosts", JSON.stringify(posts));
  }, [posts]);

  const categories = ["All", "Technology", "Lifestyle", "Travel"];

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.description.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || post.category === category;

    return matchesSearch && matchesCategory;
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openCreateForm = () => {
    setEditId(null);
    setForm({
      title: "",
      category: "Technology",
      author: "",
      image: "",
      description: "",
      content: ""
    });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId) {
      setPosts(posts.map((post) =>
        post.id === editId ? {
          ...post,
          ...form
        } : post
      ));
    } else {
      const newPost = {
        ...form,
        id: Date.now(),
        date: new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric"
        }),
        image: form.image || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800"
      };

      setPosts([newPost, ...posts]);
    }

    setShowForm(false);
    setEditId(null);
  };

  const handleEdit = (post) => {
    setEditId(post.id);
    setForm({
      title: post.title,
      category: post.category,
      author: post.author,
      image: post.image,
      description: post.description,
      content: post.content
    });
    setSelectedPost(null);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      setPosts(posts.filter((post) => post.id !== id));
      setSelectedPost(null);
    }
  };

  return (
    <div className="app">

      <header className="navbar">
        <div className="logo">
          <span>✦</span> BlogSpace
        </div>

        <nav>
          <a href="#home">Home</a>
          <a href="#blogs">Explore Blogs</a>
          <a href="#about">About</a>
        </nav>

        <div className="nav-actions">
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={openCreateForm}>
            + Create Post
          </button>
        </div>
      </header>

      <section className="hero" id="home">
        <p className="hero-label">WELCOME TO BLOGSPACE</p>

        <h1>
          Stories that inspire.
          <br />
          Ideas that <span>connect.</span>
        </h1>

        <p className="hero-description">
          Discover interesting stories, share your thoughts
          and explore ideas from creative minds.
        </p>

        <button onClick={() =>
          document.getElementById("blogs").scrollIntoView({
            behavior: "smooth"
          })
        }>
          Explore Articles →
        </button>
      </section>

      <main className="blog-section" id="blogs">

        <div className="section-heading">
          <div>
            <p className="small-label">OUR COLLECTION</p>
            <h2>Latest Articles</h2>
            <p>Explore our latest stories and ideas.</p>
          </div>
        </div>

        <div className="categories">
          {categories.map((item) => (
            <button
              key={item}
              className={category === item ? "active" : ""}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="blog-grid">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <article className="blog-card" key={post.id}>

                <img
                  src={post.image}
                  alt={post.title}
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800";
                  }}
                />

                <div className="card-content">
                  <span className="category-tag">
                    {post.category}
                  </span>

                  <h3>{post.title}</h3>

                  <p>{post.description}</p>

                  <div className="card-footer">
                    <span>{post.author}</span>
                    <button onClick={() => setSelectedPost(post)}>
                      Read More →
                    </button>
                  </div>
                </div>

              </article>
            ))
          ) : (
            <div className="no-posts">
              <h3>No posts found!</h3>
              <p>Try searching with another keyword.</p>
            </div>
          )}
        </div>

      </main>

      <section className="about-section" id="about">
        <h2>Share Your Story With The World</h2>
        <p>
          Every idea deserves a platform. Create your blog
          and inspire others with your words.
        </p>
        <button onClick={openCreateForm}>
          Start Writing →
        </button>
      </section>

      <footer>
        <h3>✦ BlogSpace</h3>
        <p>© 2026 BlogSpace. All rights reserved.</p>
      </footer>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <button
              className="close-btn"
              onClick={() => setShowForm(false)}
            >
              ✕
            </button>

            <h2>{editId ? "Edit Blog Post" : "Create New Post"}</h2>
            <p>Share your thoughts with the world.</p>

            <form onSubmit={handleSubmit}>
              <label>Post Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter blog title"
                required
              />

              <label>Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                <option>Technology</option>
                <option>Lifestyle</option>
                <option>Travel</option>
              </select>

              <label>Author Name</label>
              <input
                name="author"
                value={form.author}
                onChange={handleChange}
                placeholder="Enter author name"
                required
              />

              <label>Image URL</label>
              <input
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="Paste image URL (optional)"
              />

              <label>Short Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Write a short description"
                required
              />

              <label>Full Blog Content</label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                placeholder="Write your blog content"
                rows="5"
                required
              />

              <button className="submit-btn" type="submit">
                {editId ? "Update Post" : "Publish Post"}
              </button>
            </form>
          </div>
        </div>
      )}

      {selectedPost && (
        <div className="modal-overlay">
          <div className="modal read-modal">
            <button
              className="close-btn"
              onClick={() => setSelectedPost(null)}
            >
              ✕
            </button>

            <img src={selectedPost.image} alt={selectedPost.title} />

            <span className="category-tag">
              {selectedPost.category}
            </span>

            <h2>{selectedPost.title}</h2>

            <p className="post-meta">
              By {selectedPost.author} · {selectedPost.date}
            </p>

            <p className="full-content">
              {selectedPost.content}
            </p>

            <div className="read-actions">
              <button onClick={() => handleEdit(selectedPost)}>
                Edit Post
              </button>

              <button
                className="delete-btn"
                onClick={() => handleDelete(selectedPost.id)}
              >
                Delete Post
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
