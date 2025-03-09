import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

export default function PlansSection() {
  return (
    <section className="plans" id="plans">
      <div className="container">
        <h2>Service Plans</h2>
        <p>Choose the adventure tier that best suits your journey</p>
        
        <div className="plan-cards">
          <div className="plan-card">
            <div className="plan-header">
              <h3>Free Plan</h3>
              <p className="price">$0<span>/month</span></p>
            </div>
            <div className="plan-features">
              <div className="feature">
                <FontAwesomeIcon icon={faCheck} />
                <span>250 message limit</span>
              </div>
              <div className="feature negative">
                <FontAwesomeIcon icon={faTimes} />
                <span>Voice feature</span>
              </div>
              <div className="feature negative">
                <FontAwesomeIcon icon={faTimes} />
                <span>Image feature</span>
              </div>
              <div className="feature">
                <FontAwesomeIcon icon={faCheck} />
                <span>Basic AI performance</span>
              </div>
            </div>
            <Link href="/signup/free" className="btn plan-btn">Start Free</Link>
          </div>

          <div className="plan-card premium">
            <div className="popular-tag">Popular Choice</div>
            <div className="plan-header">
              <h3>Premium Plan</h3>
              <p className="price">$9.99<span>/month</span></p>
            </div>
            <div className="plan-features">
              <div className="feature">
                <FontAwesomeIcon icon={faCheck} />
                <span>Unlimited messages</span>
              </div>
              <div className="feature">
                <FontAwesomeIcon icon={faCheck} />
                <span>Voice AI feature</span>
              </div>
              <div className="feature">
                <FontAwesomeIcon icon={faCheck} />
                <span>Image feature</span>
              </div>
              <div className="feature">
                <FontAwesomeIcon icon={faCheck} />
                <span>Advanced AI performance</span>
              </div>
            </div>
            <Link href="/signup/premium" className="btn plan-btn">Go Premium</Link>
          </div>
        </div>
      </div>
    </section>
  );
}