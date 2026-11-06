import UserFooter from "../../components/UserFooter";
import UserHeader from "../../components/UserHeader";

function About() {
    return (
        <div>
          <UserHeader />
      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
              <div className="d-flex py-5 px-4">
                <i className="fa fa-certificate fa-3x text-primary flex-shrink-0" />
                <div className="ps-4">
                  <h5 className="mb-3">Certified Quality Service</h5>
                  <p>Factory-trained technicians using OEM parts and advanced diagnostics for all vehicle makes and models</p>
                 </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.3s">
              <div className="d-flex bg-light py-5 px-4">
                <i className="fa fa-users-cog fa-3x text-primary flex-shrink-0" />
                <div className="ps-4">
                  <h5 className="mb-3">ASE Certified Technicians</h5>
                  <p>Our team of expert mechanics has years of specialized training and real-world experience solving complex automotive issues</p>
                 </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.5s">
              <div className="d-flex py-5 px-4">
                <i className="fa fa-tools fa-3x text-primary flex-shrink-0" />
                <div className="ps-4">
                  <h5 className="mb-3">State-of-the-Art Equipment</h5>
                  <p>Computerized diagnostics, advanced alignment systems, and specialized tools for precise repairs and maintenance</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Service End */}
      {/* About Start */}
      <div className="container-xxl py-5" id="about">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-6 pt-4" style={{minHeight: 400}}>
              <div className="position-relative h-100 wow fadeIn" data-wow-delay="0.1s">
                <img className="position-absolute img-fluid w-100 h-100" src="/img/about.jpg" style={{objectFit: 'cover'}} alt="Vehicle service experience" />
                <div className="position-absolute top-0 end-0 mt-n4 me-n4 py-4 px-5" style={{background: 'rgba(0, 0, 0, .08)'}}>
                  <h1 className="display-4 text-white mb-0">15+ <span className="fs-4">Years</span></h1>
                  <h4 className="text-white">Experience</h4>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <h6 className="text-primary text-uppercase">// About Us //</h6>
              <h1 className="mb-4"><span className="text-primary">AutoCare Pro</span> Is Your Trusted Vehicle Service Partner</h1>
              <p className="mb-4">With over 15 years of experience, we've built our reputation on honesty, expertise, and exceptional customer service. We understand that your vehicle is a significant investment, which is why we treat every car with the same attention to detail as if it were our own.</p>
              <div className="row g-4 mb-3 pb-3">
                <div className="col-12 wow fadeIn" data-wow-delay="0.1s">
                  <div className="d-flex">
                    <div className="bg-light d-flex flex-shrink-0 align-items-center justify-content-center mt-1" style={{width: 45, height: 45}}>
                      <span className="fw-bold text-secondary">01</span>
                    </div>
                    <div className="ps-3">
                      <h6>Factory-Trained Specialists</h6>
                      <span>Continuous education keeps our team up-to-date with the latest vehicle technologies</span>
                    </div>
                  </div>
                </div>
                <div className="col-12 wow fadeIn" data-wow-delay="0.3s">
                  <div className="d-flex">
                    <div className="bg-light d-flex flex-shrink-0 align-items-center justify-content-center mt-1" style={{width: 45, height: 45}}>
                      <span className="fw-bold text-secondary">02</span>
                    </div>
                    <div className="ps-3">
                      <h6>Comprehensive Digital Inspections</h6>
                      <span>Detailed reports with photos show you exactly what your vehicle needs and why</span>
                    </div>
                  </div>
                </div>
                <div className="col-12 wow fadeIn" data-wow-delay="0.5s">
                  <div className="d-flex">
                    <div className="bg-light d-flex flex-shrink-0 align-items-center justify-content-center mt-1" style={{width: 45, height: 45}}>
                      <span className="fw-bold text-secondary">03</span>
                    </div>
                    <div className="ps-3">
                      <h6>Industry-Leading Warranty</h6>
                      <span>Our 3-year/36,000-mile warranty on parts and labor gives you complete peace of mind</span>
                    </div>
                  </div>
                </div>
              </div>
               </div>
          </div>
        </div>
      </div>
      <UserFooter />
</div>

  
  
    );
  }
  
  export default About;