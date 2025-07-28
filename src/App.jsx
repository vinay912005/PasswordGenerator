import { useState, useCallback, useEffect, useRef } from 'react'

function App() {
  const [length, setLength] = useState(12)
  const [numberAllow, setNumberAllow] = useState(true)
  const [charAllow, setCharAllow] = useState(true)
  const [upperCase, setUpperCase] = useState(true)
  const [lowerCase, setLowerCase] = useState(true)
  const [password, setPassword] = useState("")
  const [strength, setStrength] = useState("")
  const [strengthColor, setStrengthColor] = useState("")
  const [copied, setCopied] = useState(false)
  
  const passwordRef = useRef(null)

  const passwordGenerator = useCallback(() => {
    let pass = ""
    let str = ""
    
    if (upperCase) str += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if (lowerCase) str += "abcdefghijklmnopqrstuvwxyz"
    if (numberAllow) str += "0123456789"
    if (charAllow) str += "!@#$%^&*(){}[]+=*/-`~?<>,.;:|"
    
    if (str === "") {
      setPassword("")
      return
    }
    
    const array = new Uint32Array(length)
    crypto.getRandomValues(array)
    
    for (let i = 0; i < length; i++) {
      const randomIndex = array[i] % str.length
      pass += str.charAt(randomIndex)
    }
    
    setPassword(pass)
    setCopied(false)
  }, [length, numberAllow, charAllow, upperCase, lowerCase])

  const calculateStrength = useCallback((password) => {
    if (!password) return { strength: "", color: "" }
    
    let score = 0
    
    if (password.length >= 8) score += 1
    if (password.length >= 12) score += 1
    if (password.length >= 16) score += 1
    
    if (/[a-z]/.test(password)) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password)) score += 1
    
    if (score <= 2) return { strength: "Weak", color: "text-red-400" }
    if (score <= 4) return { strength: "Fair", color: "text-yellow-400" }
    if (score <= 6) return { strength: "Good", color: "text-blue-400" }
    return { strength: "Strong", color: "text-green-400" }
  }, [])

  const copyPasswordToClipboard = useCallback(() => {
    if (password) {
      navigator.clipboard.writeText(password)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [password])

  useEffect(() => {
    passwordGenerator()
  }, [passwordGenerator])

  useEffect(() => {
    const { strength: str, color } = calculateStrength(password)
    setStrength(str)
    setStrengthColor(color)
  }, [password, calculateStrength])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl">
          
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-700">
            <h1 className="text-xl font-semibold text-white">Password Generator</h1>
            <p className="text-sm text-gray-400 mt-1">Generate secure passwords</p>
          </div>

          {/* Password Display */}
          <div className="p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Generated Password</label>
              <div className="flex border border-gray-600 rounded-md overflow-hidden bg-gray-800">
                <input 
                  type="text" 
                  value={password}
                  className="flex-1 bg-transparent text-white px-3 py-2 font-mono text-sm outline-none"
                  placeholder="Click generate to create password"
                  readOnly
                  ref={passwordRef}
                />
                <button 
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    copied 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                  }`}
                  onClick={copyPasswordToClipboard}
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              
              {password && (
                <div className="flex items-center justify-between mt-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">Strength:</span>
                    <span className={`font-medium ${strengthColor}`}>{strength}</span>
                  </div>
                  <span className="text-gray-400">{password.length} characters</span>
                </div>
              )}
            </div>

            {/* Length Control */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-300">Length</label>
                <span className="text-sm text-gray-400">{length}</span>
              </div>
              <input 
                type="range"
                min={4}
                max={50}
                value={length}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                onChange={(e) => setLength(parseInt(e.target.value))}
                style={{
                  background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${(length-4)/(50-4)*100}%, #374151 ${(length-4)/(50-4)*100}%, #374151 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>4</span>
                <span>50</span>
              </div>
            </div>

            {/* Character Options */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">Include Characters</label>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input 
                    type="checkbox"
                    checked={upperCase}
                    id="upperCase"
                    onChange={() => setUpperCase(prev => !prev)}
                    className="h-4 w-4 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="upperCase" className="ml-3 text-sm text-gray-300">
                    Uppercase letters (A-Z)
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input 
                    type="checkbox"
                    checked={lowerCase}
                    id="lowerCase"
                    onChange={() => setLowerCase(prev => !prev)}
                    className="h-4 w-4 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="lowerCase" className="ml-3 text-sm text-gray-300">
                    Lowercase letters (a-z)
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input 
                    type="checkbox"
                    checked={numberAllow}
                    id="numberInput"
                    onChange={() => setNumberAllow(prev => !prev)}
                    className="h-4 w-4 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="numberInput" className="ml-3 text-sm text-gray-300">
                    Numbers (0-9)
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input 
                    type="checkbox"
                    checked={charAllow}
                    id="charInput"
                    onChange={() => setCharAllow(prev => !prev)}
                    className="h-4 w-4 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="charInput" className="ml-3 text-sm text-gray-300">
                    Special characters (!@#$%^&*)
                  </label>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <button 
              onClick={passwordGenerator}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Generate Password
            </button>
          </div>

          {/* Security Guidelines */}
          <div className="px-6 py-4 bg-gray-800 border-t border-gray-700 rounded-b-lg">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Security Recommendations</h3>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Use minimum 12 characters for strong security</li>
              <li>• Include mix of character types</li>
              <li>• Avoid reusing passwords across accounts</li>
              <li>• Store passwords in a secure password manager</li>
            </ul>
          </div>

        </div>
      </div>

      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          border: 2px solid #1F2937;
        }
        
        input[type="range"]::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          border: 2px solid #1F2937;
        }
      `}</style>
    </div>
  )
}

export default App