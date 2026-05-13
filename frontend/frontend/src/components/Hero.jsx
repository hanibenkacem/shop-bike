export default function Hero() {
    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');

                .hero-root {
                    font-family: 'Tajawal', sans-serif;
                    direction: rtl;
                }

                .hero-section {
                    min-height: 90vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 30px 20px;
                    background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 30%, #f0f4f3 60%, #fafbfc 100%);
                    position: relative;
                    overflow: hidden;
                    isolation: isolate;
                }

                /* Decorative background shapes */
                .hero-bg-circle-1 {
                    position: absolute;
                    width: 500px;
                    height: 500px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(34, 197, 94, 0.08) 0%, transparent 70%);
                    top: -120px;
                    left: -100px;
                    z-index: 0;
                    pointer-events: none;
                }
                .hero-bg-circle-2 {
                    position: absolute;
                    width: 350px;
                    height: 350px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(59, 130, 246, 0.07) 0%, transparent 70%);
                    bottom: -80px;
                    right: -60px;
                    z-index: 0;
                    pointer-events: none;
                }
                .hero-bg-dots {
                    position: absolute;
                    width: 200px;
                    height: 200px;
                    background-image: radial-gradient(#cbd5e1 1.5px, transparent 1.5px);
                    background-size: 20px 20px;
                    top: 15%;
                    right: 5%;
                    z-index: 0;
                    pointer-events: none;
                    opacity: 0.5;
                }

                .hero-container {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 50px;
                    max-width: 1200px;
                    width: 100%;
                    position: relative;
                    z-index: 1;
                }

                /* Text Side */
                .hero-text {
                    flex: 1 1 50%;
                    max-width: 580px;
                }

                .hero-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: #fff;
                    border: 1px solid #e2e8f0;
                    border-radius: 50px;
                    padding: 8px 18px;
                    font-size: 14px;
                    font-weight: 600;
                    color: #16a34a;
                    margin-bottom: 24px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.04);
                    animation: fadeInUp 0.6s ease forwards;
                }
                .hero-badge-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #22c55e;
                    animation: pulse-dot 2s infinite;
                }

                @keyframes pulse-dot {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(1.6); }
                }

                .hero-title {
                    font-size: clamp(36px, 5.5vw, 64px);
                    font-weight: 900;
                    line-height: 1.25;
                    color: #0f172a;
                    margin: 0 0 20px 0;
                    letter-spacing: -0.02em;
                    animation: fadeInUp 0.6s ease 0.1s forwards;
                    opacity: 0;
                }
                .hero-title-highlight {
                    background: linear-gradient(120deg, #16a34a 0%, #22c55e 50%, #15803d 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    position: relative;
                }
                .hero-title-highlight::after {
                    content: '';
                    position: absolute;
                    bottom: 4px;
                    left: 0;
                    width: 100%;
                    height: 6px;
                    background: rgba(34,197,94,0.2);
                    border-radius: 3px;
                    z-index: -1;
                }

                .hero-description {
                    font-size: clamp(16px, 1.8vw, 20px);
                    color: #475569;
                    line-height: 1.8;
                    margin: 0 0 32px 0;
                    animation: fadeInUp 0.6s ease 0.2s forwards;
                    opacity: 0;
                }

                .hero-cta-group {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    flex-wrap: wrap;
                    animation: fadeInUp 0.6s ease 0.3s forwards;
                    opacity: 0;
                }

                .hero-btn-primary {
                    background: #0f172a;
                    color: #fff;
                    padding: 16px 36px;
                    border-radius: 12px;
                    font-size: 17px;
                    font-weight: 700;
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    transition: all 0.3s ease;
                    box-shadow: 0 6px 24px rgba(15,23,42,0.2);
                    border: none;
                    cursor: pointer;
                    white-space: nowrap;
                }
                .hero-btn-primary:hover {
                    background: #1e293b;
                    transform: translateY(-3px);
                    box-shadow: 0 12px 32px rgba(15,23,42,0.3);
                }
                .hero-btn-primary:active {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 16px rgba(15,23,42,0.25);
                }
                .hero-btn-arrow {
                    transition: transform 0.3s ease;
                }
                .hero-btn-primary:hover .hero-btn-arrow {
                    transform: translateX(-6px);
                }

                .hero-btn-outline {
                    background: transparent;
                    color: #0f172a;
                    padding: 16px 28px;
                    border-radius: 12px;
                    font-size: 17px;
                    font-weight: 600;
                    text-decoration: none;
                    border: 2px solid #d1d5db;
                    transition: all 0.3s ease;
                    cursor: pointer;
                    white-space: nowrap;
                }
                .hero-btn-outline:hover {
                    border-color: #0f172a;
                    background: #f9fafb;
                    transform: translateY(-2px);
                }

                .hero-stats {
                    display: flex;
                    gap: 30px;
                    margin-top: 36px;
                    animation: fadeInUp 0.6s ease 0.4s forwards;
                    opacity: 0;
                }
                .hero-stat {
                    text-align: right;
                }
                .hero-stat-number {
                    font-size: 28px;
                    font-weight: 800;
                    color: #0f172a;
                    line-height: 1;
                }
                .hero-stat-label {
                    font-size: 13px;
                    color: #64748b;
                    margin-top: 4px;
                    font-weight: 500;
                }
                .hero-stat-divider {
                    width: 1px;
                    background: #d1d5db;
                    align-self: stretch;
                }

                /* Image Side */
                .hero-image-wrapper {
                    flex: 1 1 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    position: relative;
                    animation: fadeInUp 0.7s ease 0.2s forwards;
                    opacity: 0;
                }
                .hero-image-glow {
                    position: absolute;
                    width: 350px;
                    height: 350px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(34,197,94,0.18) 0%, rgba(34,197,94,0.04) 50%, transparent 70%);
                    z-index: 0;
                    pointer-events: none;
                    animation: glowPulse 4s ease-in-out infinite;
                }
                @keyframes glowPulse {
                    0%, 100% { transform: scale(0.9); opacity: 0.7; }
                    50% { transform: scale(1.15); opacity: 1; }
                }
                .hero-image {
                    width: 100%;
                    max-width: 550px;
                    height: auto;
                    position: relative;
                    z-index: 1;
                    filter: drop-shadow(0 20px 40px rgba(0,0,0,0.18));
                    transition: transform 0.5s ease;
                }
                .hero-image-wrapper:hover .hero-image {
                    transform: translateY(-8px) scale(1.02);
                }
                .hero-image-card {
                    position: absolute;
                    bottom: 15%;
                    left: 0;
                    background: #fff;
                    border-radius: 16px;
                    padding: 14px 20px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    z-index: 2;
                    font-size: 14px;
                    font-weight: 600;
                    color: #0f172a;
                }
                .hero-image-card-star {
                    color: #f59e0b;
                    font-size: 18px;
                }

                /* Animations */
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                /* ---------- RESPONSIVE BREAKPOINTS ---------- */
                @media (max-width: 968px) {
                    .hero-container {
                        gap: 30px;
                    }
                    .hero-stats {
                        gap: 20px;
                    }
                    .hero-stat-number {
                        font-size: 22px;
                    }
                    .hero-image-glow {
                        width: 250px;
                        height: 250px;
                    }
                }

                @media (max-width: 768px) {
                    .hero-section {
                        min-height: auto;
                        padding: 40px 16px 30px;
                    }
                    .hero-container {
                        flex-direction: column-reverse;
                        gap: 20px;
                        text-align: center;
                    }
                    .hero-text {
                        max-width: 100%;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }
                    .hero-title {
                        font-size: clamp(28px, 7vw, 44px);
                    }
                    .hero-description {
                        font-size: 16px;
                        max-width: 450px;
                    }
                    .hero-cta-group {
                        justify-content: center;
                    }
                    .hero-stats {
                        justify-content: center;
                    }
                    .hero-image-wrapper {
                        max-width: 380px;
                        margin: 0 auto;
                    }
                    .hero-image {
                        max-width: 100%;
                    }
                    .hero-image-card {
                        bottom: 8%;
                        left: -10px;
                        padding: 10px 16px;
                        font-size: 12px;
                        gap: 8px;
                        border-radius: 12px;
                    }
                    .hero-image-glow {
                        width: 200px;
                        height: 200px;
                    }
                    .hero-bg-dots {
                        display: none;
                    }
                }

                @media (max-width: 480px) {
                    .hero-section {
                        padding: 24px 12px 20px;
                    }
                    .hero-badge {
                        font-size: 12px;
                        padding: 6px 14px;
                        margin-bottom: 16px;
                    }
                    .hero-title {
                        font-size: clamp(24px, 8vw, 32px);
                    }
                    .hero-description {
                        font-size: 14px;
                        margin-bottom: 20px;
                    }
                    .hero-btn-primary,
                    .hero-btn-outline {
                        padding: 14px 22px;
                        font-size: 15px;
                        border-radius: 10px;
                    }
                    .hero-cta-group {
                        gap: 10px;
                    }
                    .hero-stats {
                        gap: 14px;
                        margin-top: 24px;
                    }
                    .hero-stat-number {
                        font-size: 18px;
                    }
                    .hero-stat-label {
                        font-size: 11px;
                    }
                    .hero-image-card {
                        bottom: 5%;
                        left: -4px;
                        padding: 8px 12px;
                        font-size: 11px;
                        gap: 6px;
                        border-radius: 10px;
                    }
                    .hero-image-card-star {
                        font-size: 14px;
                    }
                }
            `}</style>

            <div className="hero-root">
                <section className="hero-section">
                    {/* Decorative Background */}
                    <div className="hero-bg-circle-1" />
                    <div className="hero-bg-circle-2" />
                    <div className="hero-bg-dots" />

                    <div className="hero-container">
                        {/*============ RIGHT SIDE: TEXT ============*/}
                        <div className="hero-text">
                            {/* Badge */}
                           

                            {/* Title */}
                            <h1 className="hero-title">
                                أفضل الدراجات الهوائية
                                <br />
                                <span className="hero-title-highlight">بأفضل الأسعار</span>
                            </h1>

                            {/* Description */}
                            <p className="hero-description">
                                اكتشف أحدث الدراجات الهوائية المناسبة للأطفال والكبار
                                بجودة عالية وأسعار ممتازة. صممت لتمنحك تجربة قيادة
                                استثنائية على كل الطرق.
                            </p>

                            {/* CTA Buttons */}
                            <div className="hero-cta-group">
                                <a href="#categories" className="hero-btn-primary">
                                    تصفح الدراجات
                                    <svg
                                        className="hero-btn-arrow"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                        <polyline points="12 5 19 12 12 19" />
                                    </svg>
                                </a>
                                
                            </div>

                            {/* Stats */}
                            <div className="hero-stats">
                                <div className="hero-stat">
                                    <div className="hero-stat-number">+500</div>
                                    <div className="hero-stat-label">دراجة تم بيعها</div>
                                </div>
                                <div className="hero-stat-divider" />
                                <div className="hero-stat">
                                    <div className="hero-stat-number">+50</div>
                                    <div className="hero-stat-label">موديل مختلف</div>
                                </div>
                                <div className="hero-stat-divider" />
                                <div className="hero-stat">
                                    <div className="hero-stat-number">98%</div>
                                    <div className="hero-stat-label">تقييم إيجابي</div>
                                </div>
                            </div>
                        </div>

                        {/*============ LEFT SIDE: IMAGE ============*/}
                        <div className="hero-image-wrapper">
                            <div className="hero-image-glow" />
                            <img
                                src="/hero-bike.jpg"
                                alt="دراجة هوائية احترافية"
                                className="hero-image"
                                loading="eager"
                            />
                            {/* Floating Card */}
                            <div className="hero-image-card">
                                <span className="hero-image-card-star">⭐</span>
                                <span>4.9 من 5 - تقييم العملاء</span>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}