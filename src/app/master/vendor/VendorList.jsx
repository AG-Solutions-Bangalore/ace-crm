import Page from '@/app/dashboard/page'
import { Button } from '@/components/ui/button'
import { ButtonConfig } from '@/config/ButtonConfig'
import { SquarePlus } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const VendorList = () => {
    const navigate = useNavigate()
  return (
  <Page>
              
          <Button
            variant="default"
            className= {`ml-2 ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`} 
            onClick={() => navigate("/master/vendor/create-vendor")}
          >
            <SquarePlus className="h-4 w-4" /> Vendor
          </Button> 
  </Page>
  )
}

export default VendorList