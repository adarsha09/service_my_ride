function UserHeader({ user }) {
  return (
    <>
    <div className="container-fluid bg-light p-0">
    <div className="row gx-0 d-none d-lg-flex">
      <div className="col-lg-7 px-5 text-start">
        <div className="h-100 d-inline-flex align-items-center py-3 me-4">
          <small className="fa fa-map-marker-alt text-primary me-2" />
          <small>Kalladka,Karnataka</small>
        </div>
        <div className="h-100 d-inline-flex align-items-center py-3">
          <small className="far fa-clock text-primary me-2" />
          <small>Mon - Sat : 09.00 AM - 06.00 PM</small>
        </div>
      </div>
      <div className="col-lg-5 px-5 text-end">
        <div className="h-100 d-inline-flex align-items-center py-3 me-4">
          <small className="fa fa-phone-alt text-primary me-2" />
          <small>+91 9019976195</small>
        </div>
        <div className="h-100 d-inline-flex align-items-center">
          <a className="btn btn-sm-square bg-white text-primary me-1" href><i className="fab fa-facebook-f" /></a>
          <a className="btn btn-sm-square bg-white text-primary me-1" href><i className="fab fa-twitter" /></a>
          <a className="btn btn-sm-square bg-white text-primary me-1" href><i className="fab fa-linkedin-in" /></a>
          <a className="btn btn-sm-square bg-white text-primary me-0" href><i className="fab fa-instagram" /></a>
        </div>
      </div>
    </div>
  </div>

  <nav className="navbar navbar-expand-lg bg-white navbar-light shadow sticky-top p-0">
    <a href="index.html" className="navbar-brand d-flex align-items-center px-4 px-lg-5">
      <h2 className="m-0 text-primary"><i className="fa fa-car me-3" />AutoCare Pro</h2>
    </a>
    <button type="button" className="navbar-toggler me-4" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
      <span className="navbar-toggler-icon" />
    </button>
    <div className="collapse navbar-collapse" id="navbarCollapse">
      <div className="navbar-nav ms-auto p-4 p-lg-0">
        <a href="/User/Home" className="nav-item nav-link active">Home</a>
        <a href="/User/About" className="nav-item nav-link">About</a>
        <a href="/User/RequestService" className="nav-item nav-link">Request Service</a>
        <a href="/User/ViewStatus" className="nav-item nav-link">View Status</a>
        <a href="/User/Feedback" className="nav-item nav-link">Feedback</a>
        <a href="/User/UserSettings" className="nav-item nav-link">Settings</a>
        <a href="http://127.0.0.1:5001" target="_blank" className="nav-item nav-link">Detection</a>
        <a href="/" className="nav-item nav-link">Logout</a>
      </div>
       </div>
  </nav>
 </>
  );
}

export default UserHeader;