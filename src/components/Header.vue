<template>
  <header class="header">
    <div class="container">
      <div class="logo">CRM<span class="highlight">Flow</span></div>
      <nav>
        <RouterLink to="/" class="nav-link">Inicio</RouterLink>
        <a href="#contacto" class="nav-link">Contáctanos</a>
        <RouterLink to="/register" class="cta-button">Probar demo</RouterLink>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.header {
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  padding: 1.2rem 2rem;
  position: sticky;
  top: 0;
  z-index: 50;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.6rem;
  font-weight: bold;
  color: #2d3748;
}

.highlight {
  color: #14b8a6;
}

nav {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-link {
  color: #374151;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #14b8a6;
}

.cta-button {
  background-color: #14b8a6;
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.3s;
}

.cta-button:hover {
  background-color: #0d9488;
}
</style>
