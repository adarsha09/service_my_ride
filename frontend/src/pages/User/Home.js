import UserHeader from "../../components/UserHeader";
import UserFooter from "../../components/UserFooter";
function Home() {
  return (
    <div>
      {/* Topbar Start */}
      <UserHeader/>
      {/* Carousel Start */}
      <div className="container-fluid p-0 mb-5">
        <div id="header-carousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img className="w-100" src="/img/carousel-bg-1.jpg" alt="Car repair service" />
              <div className="carousel-caption d-flex align-items-center">
                <div className="container">
                  <div className="row align-items-center justify-content-center justify-content-lg-start">
                    <div className="col-10 col-lg-7 text-center text-lg-start">
                         <h6 className="text-white mb-3">
              Welcome, {localStorage.getItem("user_name") || "User"}!
                </h6>
                      <h4 className="text-white text-uppercase mb-3 animated slideInDown">// Premium Auto Care //</h4>
                      <h1 className="display-3 text-white mb-4 pb-3 animated slideInDown">Advanced Vehicle Repair & Maintenance Center</h1>
                      </div>
                    <div className="col-lg-5 d-none d-lg-flex animated zoomIn">
                      <img className="img-fluid" src="/img/carousel-1.png" alt="Vehicle repair" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="carousel-item">
              <img className="w-100" src="/img/carousel-bg-2.jpg" alt="Car detailing service" />
              <div className="carousel-caption d-flex align-items-center">
                <div className="container">
                  <div className="row align-items-center justify-content-center justify-content-lg-start">
                    <div className="col-10 col-lg-7 text-center text-lg-start">
                      <h6 className="text-white text-uppercase mb-3 animated slideInDown">// Premium Auto Care //</h6>
                      <h1 className="display-3 text-white mb-4 pb-3 animated slideInDown">Professional Vehicle Detailing & Care Solutions</h1>
                     </div>
                    <div className="col-lg-5 d-none d-lg-flex animated zoomIn">
                      <img className="img-fluid" src="/img/carousel-2.png" alt="Vehicle detailing" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#header-carousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true" />
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#header-carousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true" />
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
      {/* Carousel End */}
      {/* Service Start */}
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
      {/* About End */}

      {/* Service Start */}
      <div className="container-xxl service py-5" id="services">
        <div className="container">
          <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
            <h6 className="text-primary text-uppercase">// Our Services //</h6>
            <h1 className="mb-5">Comprehensive Vehicle Solutions</h1>
          </div>
          <div className="row g-4 wow fadeInUp" data-wow-delay="0.3s">
            <div className="col-lg-4">
              <div className="nav w-100 nav-pills me-4">
                <button className="nav-link w-100 d-flex align-items-center text-start p-4 mb-4 active" data-bs-toggle="pill" data-bs-target="#tab-pane-1" type="button">
                  <i className="fa fa-car-side fa-2x me-3" />
                  <h4 className="m-0">Computer Diagnostics</h4>
                </button>
                <button className="nav-link w-100 d-flex align-items-center text-start p-4 mb-4" data-bs-toggle="pill" data-bs-target="#tab-pane-2" type="button">
                  <i className="fa fa-car fa-2x me-3" />
                  <h4 className="m-0">Engine Repair & Maintenance</h4>
                </button>
                <button className="nav-link w-100 d-flex align-items-center text-start p-4 mb-4" data-bs-toggle="pill" data-bs-target="#tab-pane-3" type="button">
                  <i className="fa fa-cog fa-2x me-3" />
                  <h4 className="m-0">Premium Tire Services</h4>
                </button>
                <button className="nav-link w-100 d-flex align-items-center text-start p-4 mb-0" data-bs-toggle="pill" data-bs-target="#tab-pane-4" type="button">
                  <i className="fa fa-oil-can fa-2x me-3" />
                  <h4 className="m-0">Synthetic Oil Services</h4>
                </button>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="tab-content w-100">
                <div className="tab-pane fade show active" id="tab-pane-1">
                  <div className="row g-4">
                    <div className="col-md-6" style={{minHeight: 350}}>
                      <div className="position-relative h-100">
                        <img className="position-absolute img-fluid w-100 h-100" src="/img/service-1.jpg" style={{objectFit: 'cover'}} alt="Computer diagnostics" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <h3 className="mb-3">Advanced Computer Diagnostics</h3>
                      <p className="mb-4">Our state-of-the-art diagnostic equipment can pinpoint issues with your vehicle's engine, transmission, electrical systems, and more. We don't just read codes—we interpret them correctly to identify the root cause of any problem.</p>
                      <p><i className="fa fa-check text-success me-3" />Multi-system computer scanning</p>
                      <p><i className="fa fa-check text-success me-3" />Manufacturer-specific diagnostic tools</p>
                      <p><i className="fa fa-check text-success me-3" />Thorough testing and verification</p>
                      </div>
                  </div>
                </div>
                <div className="tab-pane fade" id="tab-pane-2">
                  <div className="row g-4">
                    <div className="col-md-6" style={{minHeight: 350}}>
                      <div className="position-relative h-100">
                        <img className="position-absolute img-fluid w-100 h-100" src="/img/service-2.jpg" style={{objectFit: 'cover'}} alt="Engine repair" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <h3 className="mb-3">Complete Engine Solutions</h3>
                      <p className="mb-4">From routine maintenance to complex repairs, our expert technicians are equipped to handle any engine issue. We use quality parts and follow manufacturer specifications to ensure optimal performance and longevity.</p>
                      <p><i className="fa fa-check text-success me-3" />Timing belt and chain replacement</p>
                      <p><i className="fa fa-check text-success me-3" />Fuel system cleaning and repair</p>
                      <p><i className="fa fa-check text-success me-3" />Engine rebuilds and replacements</p>
                      </div>
                  </div>
                </div>
                <div className="tab-pane fade" id="tab-pane-3">
                  <div className="row g-4">
                    <div className="col-md-6" style={{minHeight: 350}}>
                      <div className="position-relative h-100">
                        <img className="position-absolute img-fluid w-100 h-100" src="/img/service-3.jpg" style={{objectFit: 'cover'}} alt="Tire service" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <h3 className="mb-3">Professional Tire Solutions</h3>
                      <p className="mb-4">We offer a complete range of tire services including computerized alignment, balancing, rotation, and installation of premium brands. Our experts can help you select the right tires for your vehicle and driving needs.</p>
                      <p><i className="fa fa-check text-success me-3" />Four-wheel computerized alignment</p>
                      <p><i className="fa fa-check text-success me-3" />Road force balancing technology</p>
                      <p><i className="fa fa-check text-success me-3" />TPMS service and repair</p>
                    
                    </div>
                  </div>
                </div>
                <div className="tab-pane fade" id="tab-pane-4">
                  <div className="row g-4">
                    <div className="col-md-6" style={{minHeight: 350}}>
                      <div className="position-relative h-100">
                        <img className="position-absolute img-fluid w-100 h-100" src="/img/service-4.jpg" style={{objectFit: 'cover'}} alt="Oil change service" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <h3 className="mb-3">Premium Oil Change Services</h3>
                      <p className="mb-4">Regular oil changes are essential for your engine's health. We use premium synthetic oils and OEM filters to provide maximum protection and performance for your vehicle, extending engine life and improving efficiency.</p>
                      <p><i className="fa fa-check text-success me-3" />Full synthetic oil options</p>
                      <p><i className="fa fa-check text-success me-3" />OEM filter replacement</p>
                      <p><i className="fa fa-check text-success me-3" />25-point vehicle inspection included</p>
                     
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Service End */}

     <UserFooter/>
   
      {/* Back to Top */}
      <a href="#" className="btn btn-lg btn-primary btn-lg-square back-to-top"><i className="bi bi-arrow-up" /></a>
    </div>
  );
}

export default Home;