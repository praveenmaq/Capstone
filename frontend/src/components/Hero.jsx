import React from 'react';

const Hero = () => {
  return (
    <section className="hero-section" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
      overflow: 'hidden',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center'
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        animation: 'float 20s ease-in-out infinite'
      }}></div>

      <div className="hero-container" style={{
        maxWidth: 1400,
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        alignItems: 'center',
        gap: '4rem',
        padding: '2rem',
        position: 'relative',
        zIndex: 2
      }}>
        {/* Hero Text */}
        <div className="hero-text" style={{
          color: 'white'
        }}>
          <span className="hero-badge" style={{
            fontSize: '0.9rem',
            fontWeight: 600,
            letterSpacing: '0.5px',
            color: '#667eea',
            background: 'rgba(255, 255, 255, 0.95)',
            padding: '0.7rem 1.5rem',
            borderRadius: '2rem',
            marginBottom: '2rem',
            display: 'inline-block',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}>
            ✨ Welcome to Shopify 2025
          </span>

          <h1 className="hero-title" style={{
            fontSize: '3.5rem',
            lineHeight: '1.1',
            fontWeight: 800,
            margin: '1rem 0 2rem',
            color: 'white',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}>
            Your Ultimate <span style={{
              background: 'linear-gradient(45deg, #ffd700, #ffed4e)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>Shopping</span> Destination
          </h1>

          <p className="hero-description" style={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '1.2rem',
            lineHeight: '1.7',
            marginBottom: '3rem',
            maxWidth: '100%'
          }}>
            Discover millions of products, unbeatable prices, and lightning-fast delivery.
            Shop with confidence on Shopify - where quality meets convenience.
          </p>

          {/* Action buttons */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            marginBottom: '3rem'
          }}>
            <button style={{
              background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
              color: 'white',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '2rem',
              fontSize: '1.1rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 8px 25px rgba(255, 107, 107, 0.3)',
              transition: 'all 0.3s ease',
              ':hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 35px rgba(255, 107, 107, 0.4)'
              }
            }}>
              🛍️ Shop Now
            </button>
            <button style={{
              background: 'transparent',
              color: 'white',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              padding: '1rem 2rem',
              borderRadius: '2rem',
              fontSize: '1.1rem',
              fontWeight: 600,
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease'
            }}>
              📱 Download App
            </button>
          </div>

          {/* Trust indicators */}
          <div style={{
            display: 'flex',
            gap: '2rem',
            flexWrap: 'wrap',
            alignItems: 'center',
            marginTop: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🚚</span>
              <span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.9rem' }}>Free Shipping</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🔒</span>
              <span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.9rem' }}>Secure Payment</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>⭐</span>
              <span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.9rem' }}>5M+ Reviews</span>
            </div>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="hero-visual" style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Background decoration */}
          <div style={{
            position: 'absolute',
            width: '150%',
            height: '150%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
            top: '-25%',
            left: '-25%',
            zIndex: -1,
            borderRadius: '50%'
          }}></div>

          {/* Main product showcase */}
          <div style={{
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            transform: 'rotate(-5deg)'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '1.5rem',
              padding: '1.5rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              backdropFilter: 'blur(10px)',
              transform: 'translateY(-1rem)'
            }}>
              <img
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80"
                alt="Nike Shoes"
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'contain',
                  borderRadius: '1rem'
                }}
              />
              <div style={{ padding: '1rem 0', textAlign: 'center' }}>
                <h3 style={{ color: '#333', fontSize: '1rem', fontWeight: 600 }}>Premium Footwear</h3>
                <p style={{ color: '#666', fontSize: '0.8rem' }}>From ₹4,999</p>
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '1.5rem',
              padding: '1.5rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              backdropFilter: 'blur(10px)',
              transform: 'translateY(1rem)'
            }}>
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80"
                alt="Watch"
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'contain',
                  borderRadius: '1rem'
                }}
              />
              <div style={{ padding: '1rem 0', textAlign: 'center' }}>
                <h3 style={{ color: '#333', fontSize: '1rem', fontWeight: 600 }}>Smart Watches</h3>
                <p style={{ color: '#666', fontSize: '0.8rem' }}>From ₹12,999</p>
              </div>
            </div>
          </div>

          {/* Floating elements */}
          <div style={{
            position: 'absolute',
            top: '10%',
            right: '10%',
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '50%',
            width: '80px',
            height: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            animation: 'float 3s ease-in-out infinite'
          }}>
            <span style={{ fontSize: '2rem' }}>🎁</span>
          </div>

          <div style={{
            position: 'absolute',
            bottom: '15%',
            left: '15%',
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            animation: 'float 3s ease-in-out infinite 1s'
          }}>
            <span style={{ fontSize: '1.5rem' }}>💎</span>
          </div>
        </div>
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .hero-visual:hover > div:first-child > div {
          transform: rotate(-2deg) scale(1.05);
          transition: transform 0.5s ease;
        }

        @media (max-width: 768px) {
          .hero-container {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
            padding: 1rem !important;
          }
          .hero-title {
            font-size: 2.5rem !important;
            text-align: center;
          }
          .hero-description {
            text-align: center;
          }
          .hero-visual > div:first-child {
            grid-template-columns: 1fr !important;
            gap: 0.5rem !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
