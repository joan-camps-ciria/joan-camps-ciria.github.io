// Año actual en el pie
document.getElementById("anio").textContent = new Date().getFullYear();

// ===== Botón de tema claro/oscuro =====
const raiz = document.documentElement;
document.getElementById("boton-tema").addEventListener("click", () => {
  const oscuroAhora =
    raiz.dataset.theme === "dark" ||
    (!raiz.dataset.theme && matchMedia("(prefers-color-scheme: dark)").matches);
  const nuevo = oscuroAhora ? "light" : "dark";
  raiz.dataset.theme = nuevo;
  try { localStorage.setItem("tema", nuevo); } catch (e) {}
});

// ===== Terminal que escribe comandos =====
const comandos = [
  "ansible-playbook -i produccion hardening.yml",
  "kubectl rollout status deploy/tareas",
  "sudo dnf update --security -y",
  "podman build -t mi-app:2.0 .",
  "systemctl status httpd",
];
const destino = document.getElementById("escribiendo");
const sinAnimacion = matchMedia("(prefers-reduced-motion: reduce)").matches;

if (sinAnimacion) {
  destino.textContent = comandos[0];
} else {
  let indice = 0, letra = 0, borrando = false;
  const escribir = () => {
    const actual = comandos[indice];
    letra += borrando ? -1 : 1;
    destino.textContent = actual.slice(0, letra);

    let espera = borrando ? 25 : 55;
    if (!borrando && letra === actual.length) { borrando = true; espera = 1800; }
    else if (borrando && letra === 0) { borrando = false; indice = (indice + 1) % comandos.length; espera = 400; }
    setTimeout(escribir, espera);
  };
  escribir();
}

// ===== Las secciones aparecen suavemente al hacer scroll =====
const secciones = document.querySelectorAll(".seccion, .cifras");
if ("IntersectionObserver" in window && !sinAnimacion) {
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("visible"); observador.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  secciones.forEach((s) => { s.classList.add("oculto"); observador.observe(s); });
}
