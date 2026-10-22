# 🎈 TRICK OR TREAT: THE RED BALLOON

**Examen — Segundo Seguimiento**

## 1. Contexto del videojuego

*TRICK OR TREAT: THE RED BALLOON* es un videojuego interactivo desarrollado con tecnologías web: HTML5, CSS3 y JavaScript. El proyecto se realizó con la finalidad de aplicar conocimientos relacionados con la representación de objetos bidimensionales, el movimiento, la animación y la interacción gráfica.

El videojuego está inspirado en la temática de Halloween y el terror, utilizando elementos visuales relacionados con payasos siniestros, globos rojos, calabazas y escenarios oscuros. Su diseño busca crear una experiencia visual atractiva mediante una interfaz de estilo *Liquid Glass*, combinando transparencias, efectos visuales y elementos animados.

La aplicación presenta un escenario de juego en el que aparecen 25 entidades bidimensionales que se desplazan de manera continua. El jugador debe hacer clic sobre ellas para interactuar y aumentar su contador de aciertos.

## 2. Objetivo

### Objetivo general

Desarrollar un videojuego interactivo en dos dimensiones mediante HTML5, CSS3 y JavaScript, aplicando conceptos de graficación, animación, movimiento de objetos y detección de eventos para crear una experiencia de juego temática de Halloween.

### Objetivos específicos

- Representar objetos gráficos bidimensionales utilizando recursos visuales relacionados con Halloween.
- Implementar el movimiento de 25 entidades dentro de un escenario de juego.
- Aplicar diferentes patrones de desplazamiento y velocidades para generar movimiento dinámico.
- Detectar las interacciones del usuario mediante eventos de clic.
- Reubicar los objetos seleccionados en posiciones aleatorias del escenario.
- Incorporar un contador para registrar los objetos seleccionados por el jugador.
- Diseñar una interfaz visual atractiva mediante CSS y componentes de Bootstrap.
- Integrar recursos multimedia, como imágenes, música de fondo y un cursor personalizado.

## 3. Justificación

El desarrollo de este videojuego permite llevar a la práctica los conocimientos de creación y manipulación de objetos bidimensionales.

Mediante el uso de JavaScript se implementa la lógica necesaria para controlar las posiciones, velocidades y movimientos de las entidades, así como para detectar las interacciones del jugador. Estos elementos permiten comprender cómo se construyen aplicaciones gráficas dinámicas y cómo se relacionan la programación y la representación visual.

Asimismo, el proyecto fomenta la creatividad y el diseño de interfaces mediante el uso de imágenes temáticas, animaciones, efectos de transparencia y recursos multimedia. La elección de una temática de terror y Halloween busca ofrecer una experiencia entretenida que combine los aspectos técnicos de la programación con una presentación visual coherente.

Finalmente, el desarrollo con tecnologías web facilita la ejecución del videojuego desde un navegador, sin necesidad de instalar programas adicionales para jugarlo.

## 4. Operación del videojuego

### 4.1. Tecnologías utilizadas

- **HTML5:** estructura el contenido y los elementos principales de la página.
- **CSS3:** define los estilos visuales, la distribución de los elementos, los efectos de transparencia y las animaciones de la interfaz.
- **JavaScript:** controla el movimiento de los objetos, la detección de clics, la actualización del contador y la lógica del juego.
- **Bootstrap:** facilita la organización y adaptación de los componentes de la interfaz.
- **SVG e imágenes:** proporcionan los recursos gráficos utilizados en el escenario.
- **Git y GitHub:** permiten administrar las versiones del proyecto y alojar sus archivos en un repositorio.

### 4.2. Funcionamiento

Al abrir el videojuego en el navegador, se presenta una interfaz ambientada en Halloween. Dentro del escenario aparecen 25 objetos gráficos que se desplazan continuamente.

Cada entidad puede presentar distintos comportamientos de movimiento, con variaciones en dirección y velocidad. Cuando los objetos colisionan, el programa contempla comportamientos de rebote y efectos visuales breves para dar mayor dinamismo al escenario.

Cuando el jugador hace clic sobre uno de los objetos, este cambia a una posición aleatoria dentro del área de juego. Al mismo tiempo, se incrementa el contador de aciertos, permitiendo visualizar cuántos objetos ha seleccionado el usuario durante la partida.

El videojuego también incorpora elementos de ambientación, como un fondo temático, música, un cursor personalizado y una interfaz diseñada para mantener la coherencia visual con la temática de terror.

### 4.3. Instrucciones para jugar

1. Abrir el videojuego en un navegador web compatible.
2. Observar los objetos que se desplazan dentro del escenario.
3. Hacer clic sobre los objetos para seleccionarlos.
4. Cada selección válida incrementa el contador de aciertos.
5. Los objetos seleccionados reaparecen en otras posiciones del escenario.
6. Continuar interactuando con las entidades y observar sus movimientos y efectos visuales.

### 4.4. Estructura de archivos

El proyecto se organiza de la siguiente manera:

```text
videojuego2d/
├── index.html
├── style.css
├── game.js
├── README.md
└── assets/
    ├── imágenes y gráficos
    ├── fondos
    ├── iconos
    ├── cursores
    └── archivos de audio
```

**Descripción de los archivos principales:**

- `index.html`: contiene la estructura principal del videojuego.
- `style.css`: controla la apariencia visual, la distribución y los efectos gráficos.
- `game.js`: implementa la lógica, el movimiento y la interacción de los objetos.
- `assets/`: almacena los recursos gráficos y multimedia.
- `README.md`: documenta el contexto, los objetivos, la justificación, el funcionamiento y las conclusiones del proyecto.

### 4.5. Ejecución

Para ejecutar el videojuego localmente, se recomienda abrir la carpeta del proyecto en Visual Studio Code y utilizar la extensión Live Server para abrir `index.html` en el navegador.

También es posible publicar el proyecto mediante GitHub Pages, configurando el repositorio para desplegar los archivos desde la rama principal (`main`) y la carpeta raíz (`/(root)`).

Es importante conservar la estructura de carpetas y comprobar que las rutas de las imágenes, los estilos, los scripts y los archivos de audio sean correctas.

## 5. Conclusiones

El desarrollo de *TRICK OR TREAT: THE RED BALLOON* permitió aplicar conocimientos de programación web y graficación bidimensional en la creación de un videojuego interactivo. La implementación de objetos en movimiento, eventos de clic, reubicación aleatoria y un contador de aciertos demuestra la integración entre la lógica de programación y los elementos gráficos.

De igual manera, la incorporación de imágenes temáticas, música, fondos y efectos visuales contribuye a construir una experiencia más inmersiva y atractiva para el usuario. El uso de HTML5, CSS3 y JavaScript permitió organizar el proyecto en componentes independientes, facilitando su mantenimiento y futuras mejoras.

Como resultado, se obtuvo una base funcional para un videojuego de temática de terror que permite explorar conceptos de movimiento, animación e interacción gráfica. El proyecto también ofrece oportunidades para implementar nuevas características, como un modo contrarreloj, una pantalla de resultados, niveles de dificultad y un sistema de récords.

En conclusión, esta actividad permitió reforzar los conocimientos adquiridos en la materia de Graficación y comprender la importancia de combinar programación, diseño visual e interacción para desarrollar aplicaciones web dinámicas.

---

**Proyecto:** TRICK OR TREAT: THE RED BALLOON  
**Materia:** Graficación  
**Tecnologías principales:** HTML5, CSS3 y JavaScript  
**Repositorio:** GitHub