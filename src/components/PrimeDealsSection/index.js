import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import ProductCard from '../ProductCard'
import './index.css'

// define and maintaining the api status constants handler
const apiStatusConstants = {
  intial: 'INTIAL', // intialize the apistatus
  success: 'SUCCESS',
  failure: 'FAILURE',
  inprogress: 'IN_PROGRESS',
}

class PrimeDealsSection extends Component {
  state = {
    primeDeals: [],
    apiStatus: apiStatusConstants.intial, // For best practice
  }

  componentDidMount() {
    this.getPrimeDeals()
  }

  getPrimeDeals = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inprogress, // update the apistatus here when api call loader is displayed
    })
    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = 'https://apis.ccbp.in/prime-deals'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)

    // success view
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.prime_deals.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        primeDeals: updatedData,
        apiStatus: apiStatusConstants.success, // update the success list here
      })
    }
    // failure view
    else if (response.status === 401) {
      this.setState({
        apiStatus: apiStatusConstants.failure, // if the api call is failure its displayed a prime deals banner
      })
    }
  }

  renderPrimeDealsList = () => {
    const {primeDeals} = this.state
    return (
      <div className="products-list-container">
        <h1 className="primedeals-list-heading">Exclusive Prime Deals</h1>
        <ul className="products-list">
          {primeDeals.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderPrimeDealsFailureView = () => (
    <img
      src="https://assets.ccbp.in/frontend/react-js/exclusive-deals-banner-img.png"
      alt="Register Prime"
      className="register-prime-image"
    />
  )

  renderLoadingView = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  render() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success: // if it success print the primeDealsList here (logged as a primeUser)
        return this.renderPrimeDealsList()
      case apiStatusConstants.failure: // if user is not a prime user now print the primeList Banner
        return this.renderPrimeDealsFailureView()
      case apiStatusConstants.inprogress: // if user has logged and req call to server between user and server loading is displayed
        return this.renderLoadingView()
      default:
        return null
    }
  }
}

export default PrimeDealsSection
