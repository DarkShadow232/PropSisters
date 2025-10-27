import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Phone } from 'lucide-react';
import { countryCodes, CountryCode, validatePhoneNumber } from '@/data/countryCodes';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  onCountryChange?: (country: CountryCode) => void;
  selectedCountry?: CountryCode;
  placeholder?: string;
  required?: boolean;
  className?: string;
  label?: string;
  error?: string;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  onCountryChange,
  selectedCountry = countryCodes[0], // Default to Egypt
  placeholder = "Enter your phone number",
  required = false,
  className = "",
  label = "Contact Phone",
  error
}) => {
  const [phoneError, setPhoneError] = useState<string>("");

  const handlePhoneChange = (phoneValue: string) => {
    onChange(phoneValue);
    
    // Validate phone number
    if (phoneValue && selectedCountry) {
      const isValid = validatePhoneNumber(phoneValue, selectedCountry.code);
      if (!isValid) {
        setPhoneError(`Invalid phone number for ${selectedCountry.name}`);
      } else {
        setPhoneError("");
      }
    } else {
      setPhoneError("");
    }
  };

  const handleCountrySelect = (country: CountryCode) => {
    onCountryChange?.(country);
    
    // Re-validate phone number with new country
    if (value) {
      const isValid = validatePhoneNumber(value, country.code);
      if (!isValid) {
        setPhoneError(`Invalid phone number for ${country.name}`);
      } else {
        setPhoneError("");
      }
    }
  };

  const formatPhoneNumber = (phone: string) => {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    // If phone starts with country code, format it
    if (selectedCountry && digits.startsWith(selectedCountry.dialCode.replace('+', ''))) {
      const localNumber = digits.substring(selectedCountry.dialCode.replace('+', '').length);
      return `${selectedCountry.dialCode} ${localNumber}`;
    }
    
    return phone;
  };

  return (
    <div className="space-y-3">
      <Label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
        <Phone className="h-4 w-4 text-purple-500" />
        {label}
      </Label>
      
      <div className="flex gap-2">
        {/* Country Code Selector */}
        <Select 
          value={selectedCountry.code} 
          onValueChange={(value) => {
            const country = countryCodes.find(c => c.code === value);
            if (country) {
              handleCountrySelect(country);
            }
          }}
        >
          <SelectTrigger className="w-[160px] px-3 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#b94a3b] focus:border-[#b94a3b] transition-all duration-300 bg-gray-50 hover:bg-white">
            <SelectValue>
              <div className="flex items-center gap-2">
                <span className="text-lg">{selectedCountry.flag}</span>
                <span className="text-sm font-medium">{selectedCountry.dialCode}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="max-h-[300px] overflow-y-auto">
            {countryCodes.map((country) => (
              <SelectItem key={country.code} value={country.code}>
                <div className="flex items-center gap-3">
                  <span className="text-lg">{country.flag}</span>
                  <div className="flex-1">
                    <div className="font-medium">{country.name}</div>
                    <div className="text-sm text-gray-500">{country.dialCode}</div>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Phone Number Input */}
        <Input
          type="tel"
          placeholder={placeholder}
          className={`flex-1 px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#b94a3b] focus:border-[#b94a3b] transition-all duration-300 bg-gray-50 hover:bg-white ${
            phoneError || error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
          } ${className}`}
          value={value}
          onChange={(e) => handlePhoneChange(e.target.value)}
          required={required}
        />
      </div>

      {/* Error Messages */}
      {(phoneError || error) && (
        <div className="text-sm text-red-600 flex items-center gap-1">
          <span className="text-red-500">⚠</span>
          {phoneError || error}
        </div>
      )}

      {/* Phone Number Preview */}
      {value && selectedCountry && !phoneError && (
        <div className="text-sm text-green-600 flex items-center gap-1">
          <span className="text-green-500">✓</span>
          Formatted: {formatPhoneNumber(value)}
        </div>
      )}
    </div>
  );
};

export default PhoneInput;
