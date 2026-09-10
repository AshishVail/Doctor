/* =========================================================
   AURA-MED INTERNATIONAL
   MASTER JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* -----------------------------------------------------
       NAVBAR SCROLL EFFECT
    ----------------------------------------------------- */

    const navbar = document.querySelector(".navbar");

    const handleNavbarScroll = () => {
        if (!navbar) return;

        if (window.scrollY > 30) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    };

    window.addEventListener("scroll", handleNavbarScroll, {
        passive: true
    });

    handleNavbarScroll();


    /* -----------------------------------------------------
       MOBILE DRAWER
    ----------------------------------------------------- */

    const mobileToggle = document.querySelector(".mobile-toggle");
    const mobileDrawer = document.querySelector(".mobile-drawer");
    const drawerClose = document.querySelector(".drawer-close");

    const openDrawer = () => {
        if (!mobileDrawer) return;

        mobileDrawer.classList.add("open");
        document.body.classList.add("modal-open");

        mobileToggle?.setAttribute("aria-expanded", "true");
    };

    const closeDrawer = () => {
        if (!mobileDrawer) return;

        mobileDrawer.classList.remove("open");
        document.body.classList.remove("modal-open");

        mobileToggle?.setAttribute("aria-expanded", "false");
    };

    mobileToggle?.addEventListener("click", openDrawer);
    drawerClose?.addEventListener("click", closeDrawer);

    document.querySelectorAll(".mobile-drawer a").forEach(link => {
        link.addEventListener("click", closeDrawer);
    });


    /* -----------------------------------------------------
       ESC KEY
    ----------------------------------------------------- */

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeDrawer();
            closeAllModals();
        }
    });


    /* -----------------------------------------------------
       TREATMENT FILTER
    ----------------------------------------------------- */

    const filterButtons = document.querySelectorAll(".filter-btn");
    const procedureCards = document.querySelectorAll(".procedure-card");

    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            const filter = button.dataset.filter;

            filterButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            procedureCards.forEach(card => {

                const category = card.dataset.category;

                if (filter === "all" || category === filter) {
                    card.classList.remove("hidden");
                } else {
                    card.classList.add("hidden");
                }

            });

        });

    });


    /* -----------------------------------------------------
       DOCTOR QUICK VIEW MODAL
    ----------------------------------------------------- */

    const doctorModal = document.getElementById("doctorModal");

    document.querySelectorAll("[data-doctor]").forEach(button => {

        button.addEventListener("click", () => {

            if (!doctorModal) return;

            const doctor = button.closest("[data-doctor-card]");

            if (!doctor) return;

            const name = doctor.dataset.name || "AURA-MED Specialist";
            const role = doctor.dataset.role || "";
            const image = doctor.dataset.image || "";
            const bio = doctor.dataset.bio || "";

            const modalName = doctorModal.querySelector(".doctor-modal-name");
            const modalRole = doctorModal.querySelector(".doctor-modal-role");
            const modalImage = doctorModal.querySelector(".doctor-modal-image");
            const modalBio = doctorModal.querySelector(".doctor-modal-bio");

            if (modalName) modalName.textContent = name;
            if (modalRole) modalRole.textContent = role;
            if (modalImage) {
                modalImage.src = image;
                modalImage.alt = name;
            }
            if (modalBio) modalBio.textContent = bio;

            openModal(doctorModal);

        });

    });


    /* -----------------------------------------------------
       MODAL SYSTEM
    ----------------------------------------------------- */

    document.querySelectorAll(".modal-overlay").forEach(overlay => {

        overlay.addEventListener("click", event => {

            if (event.target === overlay) {
                closeModal(overlay);
            }

        });

    });

    document.querySelectorAll(".modal-close").forEach(button => {

        button.addEventListener("click", () => {

            const modal = button.closest(".modal-overlay");

            if (modal) {
                closeModal(modal);
            }

        });

    });


    function openModal(modal) {

        if (!modal) return;

        modal.classList.add("active");
        document.body.classList.add("modal-open");

    }


    function closeModal(modal) {

        if (!modal) return;

        modal.classList.remove("active");

        if (!document.querySelector(".modal-overlay.active")) {
            document.body.classList.remove("modal-open");
        }

    }


    function closeAllModals() {

        document.querySelectorAll(".modal-overlay.active")
            .forEach(modal => modal.classList.remove("active"));

        document.body.classList.remove("modal-open");

    }


    /* -----------------------------------------------------
       BOOKING FORM VALIDATION
    ----------------------------------------------------- */

    const bookingForm = document.getElementById("bookingForm");
    const successModal = document.getElementById("successModal");

    bookingForm?.addEventListener("submit", event => {

        event.preventDefault();

        const requiredFields = bookingForm.querySelectorAll(
            "input[required], select[required], textarea[required]"
        );

        let valid = true;

        requiredFields.forEach(field => {

            field.style.borderColor = "";

            if (!field.value.trim()) {

                valid = false;

                field.style.borderColor = "#B34A4A";

                field.focus();

            }

        });

        const emailField = bookingForm.querySelector('input[type="email"]');

        if (emailField && emailField.value.trim()) {

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(emailField.value.trim())) {

                valid = false;
                emailField.style.borderColor = "#B34A4A";
                emailField.focus();

            }

        }

        if (!valid) return;

        const submitButton =
            bookingForm.querySelector('button[type="submit"]');

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Request Received";
        }

        if (successModal) {
            openModal(successModal);
        }

        bookingForm.reset();

        setTimeout(() => {

            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "Request Private Consultation";
            }

        }, 800);

    });


    /* -----------------------------------------------------
       DOCTOR APPOINTMENT BUTTONS
    ----------------------------------------------------- */

    document.querySelectorAll("[data-book-doctor]").forEach(button => {

        button.addEventListener("click", () => {

            const doctorName = button.dataset.bookDoctor;

            const doctorField =
                document.getElementById("preferredDoctor");

            if (doctorField && doctorName) {

                const options =
                    Array.from(doctorField.options);

                const matchingOption =
                    options.find(option =>
                        option.textContent
                            .toLowerCase()
                            .includes(doctorName.toLowerCase())
                    );

                if (matchingOption) {
                    doctorField.value = matchingOption.value;
                }

            }

            const bookingSection =
                document.getElementById("booking");

            if (bookingSection) {
                bookingSection.scrollIntoView({
                    behavior: "smooth"
                });
            }

        });

    });


    /* -----------------------------------------------------
       TESTIMONIAL SLIDER
    ----------------------------------------------------- */

    const testimonials =
        document.querySelectorAll(".testimonial");

    const dots =
        document.querySelectorAll(".slider-dot");

    let currentTestimonial = 0;

    function showTestimonial(index) {

        if (!testimonials.length) return;

        testimonials.forEach(item => {
            item.classList.remove("active");
        });

        dots.forEach(dot => {
            dot.classList.remove("active");
        });

        testimonials[index]?.classList.add("active");
        dots[index]?.classList.add("active");

        currentTestimonial = index;

    }

    dots.forEach((dot, index) => {

        dot.addEventListener("click", () => {
            showTestimonial(index);
        });

    });

    if (testimonials.length > 1) {

        setInterval(() => {

            currentTestimonial =
                (currentTestimonial + 1) %
                testimonials.length;

            showTestimonial(currentTestimonial);

        }, 6000);

    }


    /* -----------------------------------------------------
       ACTIVE NAVIGATION LINK
    ----------------------------------------------------- */

    const currentPage =
        window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll(".main-nav a").forEach(link => {

        const href =
            link.getAttribute("href");

        if (href === currentPage) {
            link.classList.add("active");
        }

    });


    /* -----------------------------------------------------
       DATE FIELD — BLOCK PAST DATES
    ----------------------------------------------------- */

    const dateInput =
        document.querySelector('input[type="date"]');

    if (dateInput) {

        const today =
            new Date().toISOString().split("T")[0];

        dateInput.min = today;

    }


    /* -----------------------------------------------------
       SMOOTH INTERNAL LINKS
    ----------------------------------------------------- */

    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", event => {

            const targetId =
                link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target =
                document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });


    /* -----------------------------------------------------
       IMAGE ERROR FALLBACK
    ----------------------------------------------------- */

    document.querySelectorAll("img").forEach(image => {

        image.addEventListener("error", () => {

            image.style.background =
                "linear-gradient(135deg,#0B132B,#26324B)";

            image.style.objectFit = "cover";

        });

    });

});
