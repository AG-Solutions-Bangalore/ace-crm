import { NavLink, Outlet } from 'react-router-dom'
import Page from '@/app/dashboard/page'
import React, { useEffect, useState } from 'react'

const ProductIndex = () => {
  const [allowedTabs, setAllowedTabs] = useState([])


  const allTabs = [
    {
      id: 'product',
      title: 'Product',
      url: '/master/product',
      route: 'product'
    },
    {
      id: 'gr-code',
      title: 'GR Code',
      url: '/master/grcode',
      route: 'grcode'
    },
    {
      id: 'description',
      title: 'Product Description',
      url: '/master/productdescription',
      route: 'productdescription'
    }
  ]

  useEffect(() => {
    const userId = localStorage.getItem('id')
    const pageControl = JSON.parse(localStorage.getItem('pageControl')) || []
    
    
    const filteredTabs = allTabs.filter(tab => {
      const itemUrl = tab.url.replace(/^\//, "")
      return pageControl.some(
        (control) =>
          control.page === tab.title &&
          control.url === itemUrl &&
          control.userIds.includes(userId) &&
          control.status === "Active"
      )
    })
    
    setAllowedTabs(filteredTabs)
  }, [])


  if (allowedTabs.length === 0) {
    return (
      <Page>
        <div className="w-full p-8 text-center">
          <div className="text-gray-500 text-lg">
            You don't have permission to access any product management tabs.
          </div>
        </div>
      </Page>
    )
  }

  return (
    <Page>
      <div className="w-full">

        <div className="flex border-b border-gray-200">
          {allowedTabs.map((tab) => (
            <NavLink
              key={tab.id}
              to={tab.url}
              end
              className={({ isActive }) =>
                `px-6 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-b-2 border-black text-black'
                    : 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300'
                }`
              }
            >
              {tab.title}
            </NavLink>
          ))}
        </div>

     
        <div className="">
          <Outlet />
        </div>
      </div>
    </Page>
  )
}

export default ProductIndex