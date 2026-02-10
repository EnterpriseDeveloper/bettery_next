import Link from "next/link";

export default function Home() {
  //   // Add subtle scroll animations
  // const observerOptions = {
  //     threshold: 0.1,
  //     rootMargin: '0px 0px -50px 0px'
  // };

  // const observer = new IntersectionObserver((entries) => {
  //     entries.forEach(entry => {
  //         if (entry.isIntersecting) {
  //             entry.target.style.opacity = '1';
  //             entry.target.style.transform = 'translateY(0)';
  //         }
  //     });
  // }, observerOptions);

  // document.querySelectorAll('.feature-card, .benefit-card, .featured-prediction').forEach(el => {
  //     el.style.opacity = '0';
  //     el.style.transform = 'translateY(20px)';
  //     el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  //     observer.observe(el);
  // });

  // // Animate prediction bars on load
  // window.addEventListener('load', () => {
  //     const bars = document.querySelectorAll('.featured-bar-fill');
  //     bars.forEach(bar => {
  //         const width = bar.style.width;
  //         bar.style.width = '0%';
  //         setTimeout(() => {
  //             bar.style.width = width;
  //         }, 500);
  //     });
  // });
  return (
    <div>
      <div className="bg-animation">
        <div className="pixel-grid"></div>
        <div className="glow-orb orb-1"></div>
        <div className="glow-orb orb-2"></div>
      </div>

      <section className="hero container">
        <div style={{ display: "contents" }}>
          <div className="hero-content">
            <h1>Bet on reality.Not opinions.</h1>
            <p>
              Create prediction events. Stake real value. AI resolves the truth
              — blockchain enforces it.
            </p>

            <div className="hero-features">
              <span>AI-verified outcomes</span>
              <span>Cosmos-powered blockchain</span>
              <span>USDT settlements</span>
            </div>

            <div className="cta-buttons">
              <Link href="/app">
                <button className="btn btn-secondary">Launch App</button>
              </Link>
            </div>
          </div>

          <div className="prediction-card">
            <div className="card-dots">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>

            <div className="prediction-question">
              Will Bitcoin hit $100K by 2024?
            </div>

            <div className="prediction-options">
              <div className="option option-yes">
                <span className="option-label">Yes</span>
                <span className="option-percent">46%</span>
              </div>
              <div className="option option-no">
                <span className="option-label">No</span>
                <span className="option-percent">54%</span>
              </div>
            </div>

            <div className="pool-info">
              Total Pool: <span className="pool-amount">$120,500 USDT</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">How It Works</h2>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-title">Create an event</div>
              <div className="feature-desc">
                Ask a question about a real-world outcome.
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-title">Stake on outcomes</div>
              <div className="feature-desc">Bet USDT on Yes or No options.</div>
            </div>
            <div className="feature-card">
              <div className="feature-title">AI verifies reality</div>
              <div className="feature-desc">AI checks trusted sources.</div>
            </div>
            <div className="feature-card">
              <div className="feature-title">Automatic payout</div>
              <div className="feature-desc">
                Smart contracts pay the winners.
              </div>
            </div>
          </div>

          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">⚖️</div>
              <div className="benefit-title">No human judges</div>
              <div className="benefit-desc">
                No moderators.No voting. No bias.
              </div>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">ℹ️</div>
              <div className="benefit-title">AI with sources</div>
              <div className="benefit-desc">Verified by public, open data.</div>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🔻</div>
              <div className="benefit-title">Immutable payouts</div>
              <div className="benefit-desc">
                Once decided, it`&apos;`s final on-chain.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="featured-prediction">
            <div className="featured-question">
              Will SpaceX land humans on Mars before 2030?
            </div>

            <div className="featured-options">
              <div className="featured-option">
                <div className="featured-bar">
                  <div className="featured-bar-fill featured-bar-yes">
                    YES 62%
                  </div>
                </div>
              </div>
              <div className="featured-option">
                <div className="featured-bar">
                  <div className="featured-bar-fill featured-bar-no">
                    NO 38%
                  </div>
                </div>
              </div>
            </div>

            <div className="featured-meta">
              <div>
                Total Pool: <strong>$184,230 USDT</strong> | Participants:{" "}
                <strong>4,912</strong>
              </div>
              <div className="resolution-source">
                <div>Resolution Source: NASA, SpaceX official releases.</div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <p style={{ color: "var(--text-secondary)", fontSize: "18px" }}>
              AI decisions you can verify and trust.
            </p>
          </div>

          <div className="timeline">
            <div className="timeline-track">
              <div className="timeline-line"></div>
              <div className="timeline-step">
                <div className="timeline-dot"></div>
                <div className="timeline-label">Event Ends</div>
              </div>
              <div className="timeline-step">
                <div className="timeline-dot"></div>
                <div className="timeline-label">AI Fetches Sources</div>
              </div>
              <div className="timeline-step">
                <div className="timeline-dot"></div>
                <div className="timeline-label">Evidence Evaluated</div>
              </div>
              <div className="timeline-step">
                <div className="timeline-dot"></div>
                <div className="timeline-label">Outcome On-Chain</div>
              </div>
            </div>
          </div>

          <div className="tech-stack">
            <div className="tech-item">
              <div className="tech-icon">⚙️</div>
              <span>Cosmos SDK Blockchain</span>
            </div>
            <div className="tech-item">
              <div className="tech-icon">💎</div>
              <span>ERC-20 (USDT) Compatible</span>
            </div>
            <div className="tech-item">
              <div className="tech-icon">📊</div>
              <span>Transparent Event History</span>
            </div>
            <div className="tech-item">
              <div className="tech-icon">🔒</div>
              <span>Deterministic Smart Contracts</span>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: "32px" }}>
            <a
              href="#"
              style={{
                color: "var(--accent-purple)",
                textDecoration: "none",
                fontSize: "14px",
              }}
            >
              Read technical documentation →
            </a>
          </div>
        </div>
      </section>

      <section className="footer-cta">
        <div className="container">
          <h2>Predict the future. Get rewarded for being right.</h2>
          <div className="footer-buttons">
            <button className="btn btn-primary">Launch App</button>
            <button className="btn btn-secondary">Read Docs</button>
          </div>
        </div>
      </section>
    </div>
  );
}
