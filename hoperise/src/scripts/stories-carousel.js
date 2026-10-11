
// function initializeStoriesCarousel() {
//   const carousels = document.querySelectorAll(".stories-carousel");

//   carousels.forEach((carousel) => {
//     if (carousel.dataset.initialized === "true") return;

//     const track = carousel.querySelector(".stories-track");
//     if (!track) return;

//     const originalCards = Array.from(
//       track.querySelectorAll(":scope > .story-card"),
//     );

//     if (originalCards.length < 2) return;

//     carousel.dataset.initialized = "true";

//     // Duplicate the original cards for seamless looping.
//     const fragment = document.createDocumentFragment();

//     originalCards.forEach((card) => {
//       const clone = card.cloneNode(true);

//       clone.setAttribute("aria-hidden", "true");
//       clone.setAttribute("inert", "");
//       clone.classList.remove("is-centered");

//       fragment.appendChild(clone);
//     });

//     track.appendChild(fragment);

//     let originalWidth = 0;
//     let position = 0;
//     let previousTime = 0;
//     let animationFrame = 0;
//     let hasMeasured = false;

//     let isDragging = false;
//     let isHovered = false;
//     let isFocused = false;
//     let isPageVisible = !document.hidden;

//     let pointerStartX = 0;
//     let positionStart = 0;
//     let dragDistance = 0;

//     // Pixels per second. Increase to make the carousel faster.
//     const speed = 35;

//     const reducedMotion = window.matchMedia(
//       "(prefers-reduced-motion: reduce)",
//     );

//     function measureCarousel() {
//       const firstClone = track.children[originalCards.length];

//       if (!firstClone) return;

//       // Measure the original group, including the gap before its clone.
//       originalWidth =
//         firstClone.getBoundingClientRect().left -
//         track.getBoundingClientRect().left;

//       if (originalWidth <= 0) return;

//       if (!hasMeasured) {
//         // Start with a story centered in the visible carousel.
//         const firstCard = originalCards[0];
//         const cardRect = firstCard.getBoundingClientRect();
//         const carouselRect = carousel.getBoundingClientRect();

//         position =
//           cardRect.left +
//           cardRect.width / 2 -
//           (carouselRect.left + carouselRect.width / 2);

//         hasMeasured = true;
//       }

//       position = ((position % originalWidth) + originalWidth)
//         % originalWidth;

//       render();
//     }

//     function render() {
//       if (originalWidth <= 0) return;

//       track.style.transform = `translate3d(${-position}px, 0, 0)`;

//       const carouselRect = carousel.getBoundingClientRect();
//       const centerX = carouselRect.left + carouselRect.width / 2;

//       let nearestCard = null;
//       let nearestDistance = Infinity;

//       track.querySelectorAll(".story-card").forEach((card) => {
//         const rect = card.getBoundingClientRect();
//         const cardCenter = rect.left + rect.width / 2;
//         const distance = Math.abs(centerX - cardCenter);

//         if (distance < nearestDistance) {
//           nearestDistance = distance;
//           nearestCard = card;
//         }
//       });

//       track.querySelectorAll(".story-card.is-centered").forEach((card) => {
//         card.classList.remove("is-centered");
//       });

//       if (nearestCard) {
//         nearestCard.classList.add("is-centered");
//       }
//     }

//     function shouldPause() {
//       return (
//         reducedMotion.matches ||
//         isDragging ||
//         isHovered ||
//         isFocused ||
//         !isPageVisible
//       );
//     }

//     function animate(time) {
//       animationFrame = requestAnimationFrame(animate);

//       if (originalWidth <= 0) {
//         measureCarousel();
//         previousTime = time;
//         return;
//       }

//       if (previousTime === 0) {
//         previousTime = time;
//         return;
//       }

//       const delta = Math.min((time - previousTime) / 1000, 0.05);
//       previousTime = time;

//       if (!shouldPause()) {
//         position += speed * delta;

//         // Wrap to the start of the repeated set.
//         if (position >= originalWidth) {
//           position -= originalWidth;
//         }

//         render();
//       }
//     }

//     function onPointerDown(event) {
//       if (event.pointerType === "mouse" && event.button !== 0) return;

//       isDragging = true;
//       pointerStartX = event.clientX;
//       positionStart = position;
//       dragDistance = 0;
//       previousTime = 0;
//     }

//     function onPointerMove(event) {
//       if (!isDragging) return;

//       const distance = event.clientX - pointerStartX;

//       dragDistance = Math.max(dragDistance, Math.abs(distance));

//       if (dragDistance > 5 && originalWidth > 0) {
//         position = positionStart - distance;

//         position = ((position % originalWidth) + originalWidth)
//           % originalWidth;

//         render();
//       }
//     }

//     function onPointerUp() {
//       if (!isDragging) return;

//       isDragging = false;
//       previousTime = 0;

//       // Allow the click generated by pointer-up to be handled first.
//       if (dragDistance > 5) {
//         setTimeout(() => {
//           dragDistance = 0;
//         }, 0);
//       }
//     }

//     function onPointerEnter() {
//       isHovered = true;
//     }

//     function onPointerLeave() {
//       isHovered = false;
//     }

//     function onFocusIn() {
//       isFocused = true;
//     }

//     function onFocusOut(event) {
//       const nextTarget = event.relatedTarget;

//       if (!nextTarget || !carousel.contains(nextTarget)) {
//         isFocused = false;
//       }
//     }

//     function onVisibilityChange() {
//       isPageVisible = !document.hidden;
//       previousTime = 0;
//     }

//     function onReducedMotionChange() {
//       previousTime = 0;
//     }

//     function onClickCapture(event) {
//       if (dragDistance > 5) {
//         event.preventDefault();
//         event.stopPropagation();
//         dragDistance = 0;
//       }
//     }

//     // Demonstration alert for the heart button.
//     function onHeartClick(event) {
//       const heart = event.target.closest(".story-heart");

//       if (!heart || !carousel.contains(heart)) return;

//       const storyName = heart.dataset.storyName;

//       if (storyName) {
//         window.alert(
//           `Thank you for supporting ${storyName}'s story!`,
//         );
//       }
//     }

//     const resizeObserver = new ResizeObserver(() => {
//       measureCarousel();
//     });

//     resizeObserver.observe(carousel);

//     carousel.addEventListener("pointerenter", onPointerEnter);
//     carousel.addEventListener("pointerleave", onPointerLeave);
//     carousel.addEventListener("focusin", onFocusIn);
//     carousel.addEventListener("focusout", onFocusOut);
//     carousel.addEventListener("pointerdown", onPointerDown);
//     carousel.addEventListener("click", onClickCapture, true);
//     carousel.addEventListener("click", onHeartClick);

//     window.addEventListener("pointermove", onPointerMove);
//     window.addEventListener("pointerup", onPointerUp);
//     window.addEventListener("pointercancel", onPointerUp);

//     document.addEventListener("visibilitychange", onVisibilityChange);
//     reducedMotion.addEventListener("change", onReducedMotionChange);

//     measureCarousel();
//     animationFrame = requestAnimationFrame(animate);

//     function cleanup() {
//       cancelAnimationFrame(animationFrame);
//       resizeObserver.disconnect();

//       carousel.removeEventListener("pointerenter", onPointerEnter);
//       carousel.removeEventListener("pointerleave", onPointerLeave);
//       carousel.removeEventListener("focusin", onFocusIn);
//       carousel.removeEventListener("focusout", onFocusOut);
//       carousel.removeEventListener("pointerdown", onPointerDown);
//       carousel.removeEventListener("click", onClickCapture, true);
//       carousel.removeEventListener("click", onHeartClick);

//       window.removeEventListener("pointermove", onPointerMove);
//       window.removeEventListener("pointerup", onPointerUp);
//       window.removeEventListener("pointercancel", onPointerUp);

//       document.removeEventListener("visibilitychange", onVisibilityChange);
//       reducedMotion.removeEventListener("change", onReducedMotionChange);
//     }

//     document.addEventListener("astro:before-swap", cleanup, {
//       once: true,
//     });
//   });
// }

// initializeStoriesCarousel();

// document.addEventListener("astro:page-load", initializeStoriesCarousel);


function initializeStoriesCarousel() {
  const carousels = document.querySelectorAll(".stories-carousel");

  carousels.forEach((carousel) => {
    if (carousel.dataset.initialized === "true") return;

    const track = carousel.querySelector(".stories-track");
    if (!track) return;

    const cards = Array.from(track.children);
    if (cards.length < 2) return;

    carousel.dataset.initialized = "true";

    // Duplicate the cards to create a continuous loop.
    cards.forEach((card) => {
      const clone = card.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      clone.setAttribute("inert", "");
      track.appendChild(clone);
    });

    let position = 0;
    let groupWidth = 0;
    let previousTime = 0;

    const speed = 35; // Pixels per second

    function measureCarousel() {
      groupWidth =
        track.children[cards.length].offsetLeft -
        track.children[0].offsetLeft;

      if (groupWidth <= 0) {
        groupWidth = track.scrollWidth / 2;
      }
    }

    function animate(time) {
      if (!previousTime) previousTime = time;

      const delta = Math.min((time - previousTime) / 1000, 0.05);
      previousTime = time;

      if (groupWidth > 0) {
        position += speed * delta;

        if (position >= groupWidth) {
          position -= groupWidth;
        }

        track.style.transform = `translateX(-${position}px)`;

        // Highlight the card nearest the carousel's center.
        const center =
          carousel.getBoundingClientRect().left +
          carousel.getBoundingClientRect().width / 2;

        let nearestCard = null;
        let nearestDistance = Infinity;

        track.querySelectorAll(".story-card").forEach((card) => {
          const rect = card.getBoundingClientRect();
          const distance = Math.abs(
            center - (rect.left + rect.width / 2),
          );

          if (distance < nearestDistance) {
            nearestDistance = distance;
            nearestCard = card;
          }
        });

        track.querySelectorAll(".story-card").forEach((card) => {
          card.classList.toggle("is-centered", card === nearestCard);
        });
      }

      requestAnimationFrame(animate);
    }

    measureCarousel();

    window.addEventListener("resize", measureCarousel);

    requestAnimationFrame(animate);

    // Show an alert when a story's heart button is clicked.
    carousel.onclick = (event) => {
      const heart = event.target.closest(".story-heart");

      if (!heart) return;

      const name = heart.dataset.storyName;

      if (name) {
        alert(`Thank you for supporting ${name}'s story!`);
      }
    };
  });
}

if (typeof document !== "undefined") {
  initializeStoriesCarousel();
  document.addEventListener("astro:page-load", initializeStoriesCarousel);
}
