import React from 'react';
import { Link } from 'react-router-dom';
import './blog.css'; 


const mockPosts = [
  {
    id: 1,
    title: "5 Consejos para Prepararte para tu Teleconsulta",
    excerpt: "Saca el máximo provecho de tu cita médica online. Te damos 5 consejos clave para una teleconsulta exitosa...",
    imageUrl: "https://images.unsplash.com/photo-1584515933487-b9c676B5313f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    category: "Telemedicina",
    author: "Dr. Ana María Vélez",
    date: "10 de Nov, 2025"
  },
  {
    id: 2,
    title: "La Importancia de un Historial Clínico Digital",
    excerpt: "Tener tu historial médico digitalizado no solo es conveniente, sino que puede ser vital en una emergencia. Descubre por qué...",
    imageUrl: "https://images.unsplash.com/photo-1550837368-282613a0a113?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    category: "Salud Digital",
    author: "Equipo Aphonline",
    date: "05 de Nov, 2025"
  },
  {
    id: 3,
    title: "Mitos y Verdades sobre la Hipertensión",
    excerpt: "La hipertensión es un enemigo silencioso. Aclaramos los mitos más comunes para ayudarte a cuidarte mejor...",
    imageUrl: "https://images.unsplash.com/photo-1579165466949-3180a31a55d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    category: "Bienestar",
    author: "Dr. Carlos Ríos",
    date: "01 de Nov, 2025"
  },
  // --- TUS 3 NUEVAS TARJETAS ---
  {
    id: 4,
    title: "Cuidando tu Salud Mental en la Era Digital",
    excerpt: "La tecnología es una gran herramienta, pero también puede ser agotadora. Aprende a encontrar el equilibrio y a cuidar tu bienestar mental...",
    imageUrl: "https://images.unsplash.com/photo-1593113598332-cd288d649414?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    category: "Salud Mental",
    author: "Psic. Laura Gómez",
    date: "28 de Oct, 2025"
  },
  {
    id: 5,
    title: "Nutrición 101: 5 Mitos Comunes sobre la Alimentación",
    excerpt: "Desde el 'desayuno es la comida más importante' hasta 'los carbohidratos engordan'. Desmentimos 5 mitos sobre nutrición...",
    imageUrl: "https://images.unsplash.com/photo-1490645935967-10de6c7d1ebb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    category: "Nutrición",
    author: "Nut. David Corrales",
    date: "25 de Oct, 2025"
  },
  {
    id: 6,
    title: "¿Por qué elegir Aphonline? Beneficios de nuestra plataforma",
    excerpt: "No todas las plataformas de telemedicina son iguales. Te contamos qué nos hace diferentes y cómo beneficiamos tu salud...",
    imageUrl: "https://images.unsplash.com/photo-1582298623758-33d7f0f06f52?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    category: "Aphonline",
    author: "Equipo Aphonline",
    date: "20 de Oct, 2025"
  }
];

const Blog = () => {
  return (
    <div className="blog-page">

      {/* --- Sección Hero --- */}
      <section className="blog-hero">
        <div className="blog-hero-content">
          <h1>Nuestro Blog</h1>
          <p>Artículos, consejos y noticias del equipo de Aphonline para ayudarte a cuidar tu salud y bienestar.</p>
        </div>
      </section>

      {/* --- Contenido del Blog (Grid) --- */}
      <section className="blog-content">
        <div className="blog-grid">
          {mockPosts.map((post) => (
            <div key={post.id} className="post-card">
              
              <div className="post-image-container">
                <img src={post.imageUrl} alt={post.title} className="post-image" />
                <span className="post-category">{post.category}</span>
              </div>
              
              <div className="post-content">
                <h3 className="post-title">{post.title}</h3>
                <p className="post-excerpt">{post.excerpt}</p>
                <div className="post-meta">
                  <span>Por {post.author}</span>
                  <span>{post.date}</span>
                </div>
                <Link to={`/blog/${post.id}`} className="post-read-more">
                  Leer Más &rarr;
                </Link>
              </div>

            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Blog;