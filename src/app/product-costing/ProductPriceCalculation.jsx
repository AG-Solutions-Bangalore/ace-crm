import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Page from '../dashboard/page'
import { useQuery } from '@tanstack/react-query'
import BASE_URL from '@/config/BaseUrl'

const ProductPriceCalculation = () => {
  const [perMetricTon, setPerMetricTon] = useState(1000)
  const [productRate, setProductRate] = useState('')
  const [wastage, setWastage] = useState('')
  const [selectedParameter, setSelectedParameter] = useState('')
  const [calculatedData, setCalculatedData] = useState([])
  const [totalSum, setTotalSum] = useState(0)
  const [grandTotal, setGrandTotal] = useState(0)
  const [drawbackAmount, setDrawbackAmount] = useState(0)
  const [showChargesDialog, setShowChargesDialog] = useState(false)
  const [usdRate, setUsdRate] = useState(null)
  const [usdPerMt, setUsdPerMt] = useState(0)

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch('https://api.frankfurter.dev/v1/latest?from=INR&to=USD');
        const data = await response.json();
        if (data && data.rates && data.rates.USD) {
          setUsdRate(data.rates.USD);
        }
      } catch (error) {
        console.error('Failed to fetch exchange rate:', error);
      }
    };
    fetchExchangeRate();
  }, []);

  useEffect(() => {
    if (usdRate !== null && grandTotal > 0) {
      const usdValue = grandTotal * usdRate;
      setUsdPerMt(parseFloat(usdValue.toFixed(2)));
    } else {
      setUsdPerMt(0);
    }
  }, [grandTotal, usdRate]);

  const { data: costingParameters, isLoading } = useQuery({
    queryKey: ["costing-parameters-list"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-costing-parameters-list`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.costing || [];
    },
  });

  const { data: existingCosting, isLoading: isLoadingExisting } = useQuery({
    queryKey: ['costing-parameters-by-id', selectedParameter],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-costing-parameters-by-id/${selectedParameter}`,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data.costing;
    },
    enabled: !!selectedParameter,
  });

  const totalMT = 
    wastage !== '' && Number(wastage) < 100 && productRate !== ''
      ? ((perMetricTon / (100 - Number(wastage))) * 100).toFixed(2)
      : ''

  const isDropdownEnabled = perMetricTon > 0 && productRate !== '' && wastage !== '' && totalMT !== ''

  const calculateAMC = (amcPercentage) => {
    if (!productRate || !totalMT) return 0
    return (parseFloat(productRate) * parseFloat(totalMT) * (amcPercentage / 100))
  }

  useEffect(() => {
    if (existingCosting && productRate && totalMT) {
      try {
        const parameters = JSON.parse(existingCosting.costing_parameters)
        let sumWithoutDrawback = 0
        
        const processedData = parameters.map(param => {
          let calculatedValue = 0
          
          if (param.name === 'AMC' && param.unit === '%') {
            calculatedValue = calculateAMC(param.value)
          } 
          else if (param.name === 'Drawback' && param.unit === '%') {
            return {
              name: param.name,
              originalValue: param.value,
              unit: param.unit,
              type: param.type,
              calculatedValue: 0
            }
          }
          else if (param.type === 'number') {
            calculatedValue = parseFloat(param.value) || 0
          }
          
          if (param.name !== 'Drawback') {
            sumWithoutDrawback += calculatedValue
          }
          
          return {
            name: param.name,
            originalValue: param.value,
            unit: param.unit,
            type: param.type,
            calculatedValue: calculatedValue
          }
        })

        const productValue = parseFloat(productRate) * parseFloat(totalMT)
        
        const drawbackParam = parameters.find(p => p.name === 'Drawback')
        let calculatedDrawback = 0
        
        const finalData = processedData.map(item => {
          if (item.name === 'Drawback' && drawbackParam) {
            calculatedDrawback = (productValue + sumWithoutDrawback) * (parseFloat(drawbackParam.value) / 100)
            return {
              ...item,
              calculatedValue: parseFloat(calculatedDrawback.toFixed(2))
            }
          }
          return item
        })

        setCalculatedData(finalData)
        setDrawbackAmount(parseFloat(calculatedDrawback.toFixed(2)))
        
        const totalWithoutDrawback = parseFloat(sumWithoutDrawback.toFixed(2))
        setTotalSum(totalWithoutDrawback)
        
        const grandTotalValue = productValue + totalWithoutDrawback - calculatedDrawback
        setGrandTotal(parseFloat(grandTotalValue.toFixed(2)))
        
      } catch (error) {
        console.error('Error parsing costing parameters:', error)
        setCalculatedData([])
        setTotalSum(0)
        setDrawbackAmount(0)
        setGrandTotal(0)
      }
    } else {
      setCalculatedData([])
      setTotalSum(0)
      setDrawbackAmount(0)
      setGrandTotal(0)
    }
  }, [existingCosting, productRate, totalMT])

  useEffect(() => {
    if (!productRate || !totalMT || !selectedParameter) {
      setCalculatedData([])
      setTotalSum(0)
      setDrawbackAmount(0)
      setGrandTotal(0)
    }
  }, [productRate, totalMT, selectedParameter])

  return (
    <Page>
      {showChargesDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Cost Breakdown Details</h3>
              <button
                onClick={() => setShowChargesDialog(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-semibold">Charge Name</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold">Original Value</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold">Calculated Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {isLoadingExisting ? (
                      <tr>
                        <td colSpan="3" className="px-4 py-4 text-center">
                          Loading data...
                        </td>
                      </tr>
                    ) : calculatedData.length > 0 ? (
                      calculatedData.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2">{item.name}</td>
                          <td className="px-4 py-2">
                            {item.originalValue}{item.unit}
                          </td>
                          <td className="px-4 py-2 font-medium">
                            ₹{item.calculatedValue.toFixed(2)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="px-4 py-4 text-center text-gray-500">
                          {selectedParameter ? 'Enter all required fields to view calculations' : 'Select a costing parameter to view calculations'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowChargesDialog(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Per Metric Ton
          </label>
          <input
            type="number"
            value={perMetricTon}
            onChange={(e) => setPerMetricTon(Number(e.target.value))}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Rate (in KG)
          </label>
          <input
            type="number"
            placeholder="Enter rate per KG"
            value={productRate}
            onChange={(e) => setProductRate(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Wastage (%)
          </label>
          <input
            type="number"
            placeholder="Enter wastage %"
            value={wastage}
            onChange={(e) => setWastage(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total MT (Auto Calculated)
          </label>
          <input
            type="number"
            value={totalMT}
            readOnly
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Costing Parameters
          </label>
          <select
            value={selectedParameter}
            onChange={(e) => setSelectedParameter(e.target.value)}
            disabled={!isDropdownEnabled || isLoading}
            className={`w-full rounded-md border border-gray-300 px-3 py-2 text-sm ${
              !isDropdownEnabled ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
          >
            <option value="">Select Parameter</option>
            {costingParameters?.map(param => (
              <option key={param.id} value={param.id}>
                {param.costing_parameters_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">Raw Material</p>
            <p className="text-lg font-semibold">
              {productRate && totalMT ? `₹${(parseFloat(productRate) * parseFloat(totalMT)).toFixed(2)}` : '₹0.00'}
            </p>
          </div>
          
          <div 
            className="cursor-pointer hover:bg-blue-100 p-2 rounded transition-colors"
            onClick={() => setShowChargesDialog(true)}
          >
            <p className="text-sm text-gray-600 flex items-center gap-1">
              Processing Charges (without Drawback)
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </p>
            <p className="text-lg font-semibold">₹{totalSum.toFixed(2)}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600">Drawback Amount</p>
            <p className="text-lg font-semibold">₹{drawbackAmount.toFixed(2)}</p>
          </div>
          
          <div className="bg-green-50 p-3 rounded">
            <p className="text-sm text-gray-600">INR PER MT / USD PER MT</p>
           <div className='flex items-center'>
           <p >
            
            
         <span className="text-xl font-bold text-green-700">   ₹{grandTotal.toFixed(2)}</span> /
         <span className="text-lg font-semibold text-blue-700">   ${usdPerMt.toFixed(2)}</span>
            
            
            
            </p>
           
           </div>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500 text-center">
          Grand Total Formula: Product Value + Total Charges (without Drawback) - Drawback Amount
        </div>
      </div>
    </Page>
  )
}

export default ProductPriceCalculation