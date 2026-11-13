(() => {
    "use strict";

    // ============================================
    // 1. CONFIG
    // ============================================

    if (window.__mgAnalyticsInitialized) return;
    window.__mgAnalyticsInitialized = true;

    const CONFIG = {
        GA_ID: "G-X2TWJJZHHZ",

        CONSENT_KEY: "mg_analytics_consent_v1",

        DEBUG: false
    };

    const EVENT_NAMES = new Set([
        "mg_nav_click",
        "mg_demo_click",
        "mg_contact_click",
        "mg_phone_click",
        "mg_email_click",
        "mg_whatsapp_click",
        "mg_social_click",
        "mg_privacy_click",
        "mg_menu_toggle",
        "mg_section_view",
        "mg_demo_action"
    ]);

    // Yalnizca onceden tanimlanmis,
    // kisisel bilgi icermeyen etiketler.

    const ALLOWED_LABELS = new Set([
        // Ana sayfa
        "home_logo",
        "solution",
        "features",
        "how_it_works",
        "sectors",
        "developer",
        "explore_features",
        "live_demo",
        "request_demo_meeting",
        "platform_discussion",
        "call_contact",
        "email_contact",
        "linkedin_placeholder",
        "mobile_menu",

        // Iletisim sayfasi
        "return_home",
        "email_demo",
        "whatsapp_contact",
        "whatsapp_demo",
        "privacy_policy",

        // Servis formu tanitim sayfasi
        "demo_form",
        "demo_hero",
        "demo_footer",
        "contact_hero",
        "contact_footer",
        "contact_header",
        "form_demo",
        "footer_demo",
        "footer_contact",
        "footer_email",
        "home_breadcrumb",

        // Demo sayfasi
        "demo_add_device",
        "demo_remove_device",
        "demo_add_part",
        "demo_remove_part",
        "demo_sign_technician",
        "demo_sign_customer",
        "demo_clear_technician",
        "demo_clear_customer",
        "demo_reset",
        "demo_print_requested",
        "demo_submit_invalid",
        "demo_service_type",
        "demo_control_check"
    ]);

    const ALLOWED_PLACEMENTS = new Set([
        "header",
        "hero",
        "contact",
        "footer",
        "content",
        "navigation",
        "breadcrumb",
        "cta",
        "sidebar",
        "demo",
        "form"
    ]);

    const ALLOWED_SECTIONS = new Set([
        // Ana sayfa
        "hero",
        "solution",
        "features",
        "how_it_works",
        "sectors",
        "developer",
        "contact_cta",

        // Iletisim
        "contact_hero",
        "contact_methods",
        "demo_methods",

        // Urun tanitim
        "product_hero",
        "product_intro",
        "product_benefits",
        "product_steps",
        "product_sectors",
        "product_faq",
        "product_cta",

        // Alternatif bolum kimlikleri
        "form_hero",
        "form_intro",
        "form_benefits",
        "form_steps",
        "form_sectors",
        "form_faq",
        "form_cta",

        // Demo
        "demo_hero",
        "demo_customer",
        "demo_equipment",
        "demo_operations",
        "demo_signatures",
        "demo_form",
        "demo_customer_info",
        "demo_devices",
        "demo_checks"
    ]);

    const DEMO_ACTIONS = new Set([
        "demo_add_device",
        "demo_remove_device",
        "demo_add_part",
        "demo_remove_part",
        "demo_sign_technician",
        "demo_sign_customer",
        "demo_clear_technician",
        "demo_clear_customer",
        "demo_reset",
        "demo_print_requested",
        "demo_submit_invalid",
        "demo_service_type",
        "demo_control_check"
    ]);

    // ============================================
    // 2. STATE
    // ============================================

    let enabled = false;
    let gaLoaded = false;
    let sectionObserver = null;

    const viewedSections = new Set();
    const startedSignatures = new Set();

    // ============================================
    // 3. DEBUG
    // ============================================

    function debug(...args) {
        if (!CONFIG.DEBUG) return;

        console.log("[MG Analytics]", ...args);
    }

    // ============================================
    // 4. CONSENT STORAGE
    // ============================================

    function getConsent() {
        try {
            return localStorage.getItem(CONFIG.CONSENT_KEY);
        } catch (error) {
            debug("Consent okunamadi", error);
            return null;
        }
    }

    function setConsent(value) {
        try {
            localStorage.setItem(
                CONFIG.CONSENT_KEY,
                value
            );
        } catch (error) {
            debug("Consent kaydedilemedi", error);
        }
    }

    // ============================================
    // 5. GA4 EVENT TRACKING
    // ============================================

    function track(eventName, params = {}) {
        if (!enabled) return false;

        if (!EVENT_NAMES.has(eventName)) {
            debug("Izin verilmeyen event:", eventName);
            return false;
        }

        if (typeof window.gtag !== "function") {
            debug("gtag mevcut degil");
            return false;
        }

        // GA4'e yalnizca izin verilen
        // parametreleri gonderiyoruz.
        const safeParams = {};

        if (
            typeof params.link_id === "string" &&
            ALLOWED_LABELS.has(params.link_id)
        ) {
            safeParams.link_id = params.link_id;
        }

        if (
            typeof params.placement === "string" &&
            ALLOWED_PLACEMENTS.has(params.placement)
        ) {
            safeParams.placement = params.placement;
        }

        if (
            typeof params.section_id === "string" &&
            ALLOWED_SECTIONS.has(params.section_id)
        ) {
            safeParams.section_id = params.section_id;
        }

        if (
            typeof params.action_id === "string" &&
            DEMO_ACTIONS.has(params.action_id)
        ) {
            safeParams.action_id = params.action_id;
        }

        // URL query string veya hash eklenmez.
        safeParams.page_path = window.location.pathname;

        safeParams.transport_type = "beacon";

        window.gtag(
            "event",
            eventName,
            safeParams
        );

        debug("Event:", eventName, safeParams);

        return true;
    }

    // ============================================
    // 6. GOOGLE ANALYTICS INITIALIZATION
    // ============================================

    function enableAnalytics() {
        if (enabled) return;

        enabled = true;

        if (!gaLoaded) {
            gaLoaded = true;

            window.dataLayer =
                window.dataLayer || [];

            if (typeof window.gtag !== "function") {
                window.gtag = function () {
                    window.dataLayer.push(arguments);
                };
            }

            window.gtag("consent", "default", {
                analytics_storage: "granted",
                ad_storage: "denied",
                ad_user_data: "denied",
                ad_personalization: "denied"
            });

            window.gtag("js", new Date());

            window.gtag("config", CONFIG.GA_ID);

            const script = document.createElement(
                "script"
            );

            script.async = true;

            script.src =
                "https://www.googletagmanager.com/gtag/js?id=" +
                encodeURIComponent(CONFIG.GA_ID);

            document.head.appendChild(script);
        } else {
            window.gtag("consent", "update", {
                analytics_storage: "granted",
                ad_storage: "denied",
                ad_user_data: "denied",
                ad_personalization: "denied"
            });
        }

        startSectionTracking();

        debug("Analytics aktif");
    }

    function rejectAnalytics() {
        enabled = false;

        if (sectionObserver) {
            sectionObserver.disconnect();
            sectionObserver = null;
        }

        if (typeof window.gtag === "function") {
            window.gtag("consent", "update", {
                analytics_storage: "denied",
                ad_storage: "denied",
                ad_user_data: "denied",
                ad_personalization: "denied"
            });
        }

        debug("Analytics reddedildi");
    }

    // ============================================
    // 7. CONSENT BANNER
    // ============================================

    const consentBanner =
        document.getElementById("mgConsentBanner");

    const consentSettings =
        document.getElementById("mgConsentSettings");

    function showConsentBanner() {
        if (consentBanner) {
            consentBanner.hidden = false;
        }
    }

    function hideConsentBanner() {
        if (consentBanner) {
            consentBanner.hidden = true;
        }
    }

    function handleConsent(value) {
        if (value === "accept") {
            setConsent("accepted");
            enableAnalytics();
            hideConsentBanner();
        }

        if (value === "reject") {
            setConsent("rejected");
            rejectAnalytics();
            hideConsentBanner();
        }
    }

    // Banner icindeki butonlar
    document.addEventListener("click", (event) => {
        const target =
            event.target instanceof Element
                ? event.target.closest(
                    "[data-mg-consent]"
                )
                : null;

        if (!target) return;

        const answer = target.getAttribute(
            "data-mg-consent"
        );

        handleConsent(answer);
    });

    if (consentSettings) {
        consentSettings.addEventListener(
            "click",
            showConsentBanner
        );
    }

    // Daha once verilen izin
    const storedConsent = getConsent();

    if (storedConsent === "accepted") {
        enableAnalytics();
    } else if (storedConsent === "rejected") {
        rejectAnalytics();
    } else {
        showConsentBanner();
    }

    // ============================================
    // 8. CLICK EVENT TRACKING
    // ============================================

    document.addEventListener("click", (event) => {
        if (!enabled) return;

        const target =
            event.target instanceof Element
                ? event.target.closest(
                    "[data-mg-event]"
                )
                : null;

        if (!target) return;

        const eventName = target.getAttribute(
            "data-mg-event"
        );

        const label = target.getAttribute(
            "data-mg-label"
        );

        const placement = target.getAttribute(
            "data-mg-placement"
        );

        if (!EVENT_NAMES.has(eventName)) {
            return;
        }

        if (!ALLOWED_LABELS.has(label)) {
            debug("Bilinmeyen label:", label);
            return;
        }

        if (!ALLOWED_PLACEMENTS.has(placement)) {
            debug("Bilinmeyen placement:", placement);
            return;
        }

        track(eventName, {
            link_id: label,
            placement
        });
    });

    // ============================================
    // 9. SECTION VIEW TRACKING
    // ============================================

    function startSectionTracking() {
        if (
            sectionObserver ||
            !("IntersectionObserver" in window)
        ) {
            return;
        }

        const sections = document.querySelectorAll(
            "[data-mg-section]"
        );

        if (sections.length === 0) return;

        sectionObserver = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (!entry.isIntersecting) {
                        continue;
                    }

                    const sectionId =
                        entry.target.getAttribute(
                            "data-mg-section"
                        );

                    if (!ALLOWED_SECTIONS.has(sectionId)) {
                        continue;
                    }

                    if (viewedSections.has(sectionId)) {
                        continue;
                    }

                    viewedSections.add(sectionId);

                    track("mg_section_view", {
                        section_id: sectionId
                    });

                    sectionObserver.unobserve(
                        entry.target
                    );
                }
            },
            {
                threshold: 0.25
            }
        );

        sections.forEach((section) => {
            sectionObserver.observe(section);
        });

        debug("Section tracking aktif");
    }

    // ============================================
    // 10. DEMO FORM TRACKING
    // ============================================

    const demoForm =
        document.getElementById("serviceForm");

    if (demoForm) {
        debug("Demo formu bulundu");

        // ----------------------------------------
        // Cihaz ekle
        // ----------------------------------------

        const addDevice =
            document.getElementById("addDevice");

        if (addDevice) {
            addDevice.addEventListener("click", () => {
                trackDemoAction("demo_add_device");
            });
        }

        // ----------------------------------------
        // Parca ekle
        // ----------------------------------------

        const addPart =
            document.getElementById("addPart");

        if (addPart) {
            addPart.addEventListener("click", () => {
                trackDemoAction("demo_add_part");
            });
        }

        // ----------------------------------------
        // Cihaz / parca sil
        // ----------------------------------------

        demoForm.addEventListener("click", (event) => {
            const button =
                event.target instanceof Element
                    ? event.target.closest(".remove")
                    : null;

            if (!button) return;

            if (button.closest("#devices")) {
                trackDemoAction("demo_remove_device");
            }

            if (button.closest("#parts")) {
                trackDemoAction("demo_remove_part");
            }
        });

        // ----------------------------------------
        // Imza baslangici
        // ----------------------------------------

        const techCanvas =
            document.getElementById("techSig");

        const clientCanvas =
            document.getElementById("clientSig");

        function handleSignatureStart(
            canvas,
            action
        ) {
            if (!canvas) return;

            canvas.addEventListener(
                "pointerdown",
                () => {
                    // Her izinli sayfa goruntulemesinde
                    // ilk imza baslangicini olcer.
                    if (startedSignatures.has(action)) {
                        return;
                    }

                    startedSignatures.add(action);

                    trackDemoAction(action);
                }
            );
        }

        handleSignatureStart(
            techCanvas,
            "demo_sign_technician"
        );

        handleSignatureStart(
            clientCanvas,
            "demo_sign_customer"
        );

        // ----------------------------------------
        // Imza temizleme
        // ----------------------------------------

        demoForm.addEventListener("click", (event) => {
            const button =
                event.target instanceof Element
                    ? event.target.closest(
                        "[data-clear]"
                    )
                    : null;

            if (!button) return;

            const canvasId = button.getAttribute(
                "data-clear"
            );

            if (canvasId === "techSig") {
                trackDemoAction(
                    "demo_clear_technician"
                );
            }

            if (canvasId === "clientSig") {
                trackDemoAction(
                    "demo_clear_customer"
                );
            }
        });

        // ----------------------------------------
        // Formu sifirla
        // ----------------------------------------

        demoForm.addEventListener("reset", () => {
            trackDemoAction("demo_reset");
        });

        // ----------------------------------------
        // PDF olusturma girisimi
        // ----------------------------------------

        demoForm.addEventListener("submit", () => {
            if (!demoForm.checkValidity()) {
                trackDemoAction(
                    "demo_submit_invalid"
                );

                return;
            }

            trackDemoAction(
                "demo_print_requested"
            );
        });

        // ----------------------------------------
        // Hizmet turu secimi
        // ----------------------------------------

        demoForm.addEventListener("change", (event) => {
            const target = event.target;

            if (!(target instanceof HTMLInputElement)) {
                return;
            }

            if (target.name === "hizmet") {
                trackDemoAction(
                    "demo_service_type"
                );
            }

            if (target.name === "kontrol") {
                trackDemoAction(
                    "demo_control_check"
                );
            }
        });
    }

    // ============================================
    // 11. DEMO ACTION HELPER
    // ============================================

    function trackDemoAction(actionId) {
        if (!DEMO_ACTIONS.has(actionId)) {
            return;
        }

        track("mg_demo_action", {
            action_id: actionId,
            placement: "demo"
        });
    }

    // ============================================
    // 12. PUBLIC SAFE TRACK METHOD
    // ============================================

    // Gerektiginde mevcut site JS kodundan
    // kontrollu event gondermek icin.

    window.mgAnalyticsTrack = function (
        eventName,
        params = {}
    ) {
        return track(eventName, params);
    };

    debug("MG Analytics Tracker hazir");
})();