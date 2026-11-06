function UserFooter() {
  return (
    <div className="container-fluid bg-dark text-light footer pt-5 mt-5 wow fadeIn" data-wow-delay="0.1s">
    <div className="container py-5">
      <div className="row g-5">
        <div className="col-lg-3 col-md-6">
          <h4 className="text-light mb-4">Our Location</h4>
          <p className="mb-2"><i className="fa fa-map-marker-alt me-3" />Kalladka, Karnataka</p>
          <p className="mb-2"><i className="fa fa-phone-alt me-3" />+91 9019976195</p>
          <p className="mb-2"><i className="fa fa-envelope me-3" />service@autocarepro.com</p>
          <div className="d-flex pt-2">
            <a className="btn btn-outline-light btn-social" href="#"><i className="fab fa-twitter" /></a>
            <a className="btn btn-outline-light btn-social" href="#"><i className="fab fa-facebook-f" /></a>
            <a className="btn btn-outline-light btn-social" href="#"><i className="fab fa-youtube" /></a>
            <a className="btn btn-outline-light btn-social" href="#"><i className="fab fa-linkedin-in" /></a>
          </div>
        </div>
        <div className="col-lg-3 col-md-6">
          <h4 className="text-light mb-4">Service Hours</h4>
          <h6 className="text-light">Monday - Friday:</h6>
          <p className="mb-4">9:30 AM - 6:00 PM</p>
          <h6 className="text-light">Saturday:</h6>
          <p className="mb-0">10:00 AM - 3:00 PM</p>
          <h6 className="text-light">Sunday:</h6>
          <p className="mb-0">Closed</p>
        </div>
        <div className="col-lg-3 col-md-6">
          <h4 className="text-light mb-4">Quick Links</h4>
          <a className="btn btn-link" href="/User/Home">Home</a>
          <a className="btn btn-link" href="/User/About">About Us</a>
          <a className="btn btn-link" href="/User/RequestService">Request Service</a>
          <a className="btn btn-link" href="/User/ViewStatus">View Status</a>
          <a className="btn btn-link" href="/User/Feedback">Feedback</a>
        </div>
       
      </div>
    </div>
    <div className="container">
      <div className="copyright">
        <div className="row">
          <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
            © <a className="border-bottom" href="#">AutoCare Pro</a>, All Rights Reserved.
          </div>
          <div className="col-md-6 text-center text-md-end">
           
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}

export default UserFooter;