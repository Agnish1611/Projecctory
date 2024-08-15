import { Link } from 'react-router-dom';

function Error404() {
  return (
    <section className="page_404">
        <div className="container">
            <div className="four_zero_four_bg">
                <h1 className="text-center ">404</h1>
            </div>
            <div className="contant_box_404">
                <h3 className="h2">
                    Look like you're lost
                </h3>
                <p>the page you are looking for not avaible!</p>
                <Link to='/login'><div className="link_404">Go to Login</div></Link>
            </div>
        </div>
    </section>
  )
}

export default Error404