// src/components/DonationComponent.tsx

"use client";

import { useState } from "react";
import { Button } from "@/src/components/shared/components/ui/button";
import { Heart, X } from "lucide-react"; 
import { loadStripe } from '@stripe/stripe-js';
import { showErrorToast } from "@/src/utils/Toast"; 

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/src/components/shared/components/ui/dialog";
import { Input } from "@/src/components/shared/components/ui/input";
import { Label } from "@/src/components/shared/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/src/components/shared/components/ui/radio-group";
import { UserAPIMethods } from "@/src/services/APImethods";
import { usePathname, useSearchParams } from "next/navigation";
import { useUserContext } from "@/src/context/userAuthContext";
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');
const predefinedAmounts = [100, 250, 500, 1000]; 

export default function DonationComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | 'custom'>(250); 
  const [customAmount, setCustomAmount] = useState<string>('');
  const {setCurentUrl}=useUserContext()
  const pathname = usePathname()
    const searchParams = useSearchParams()
  
    const currentUrl = `${pathname}?${searchParams.toString()}`
  
  const handleAmountChange = (value: string) => {
    if (value === 'custom') {
      setSelectedAmount('custom');
    } else {
      setSelectedAmount(Number(value));
    }
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      setCustomAmount(value);
    }
  };

  const handleConfirmDonate = async () => {
    let finalAmount: number;

    if (selectedAmount === 'custom') {
      finalAmount = parseFloat(customAmount);
      if (isNaN(finalAmount) || finalAmount <= 0) {
        showErrorToast("Please enter a valid donation amount.");
        return;
      }
    } else {
      finalAmount = selectedAmount;
    }

    const stripe = await stripePromise;

    if (!stripe) {
      showErrorToast("Stripe is not loaded. Please try again.");
      return;
    }
   
    const res = await UserAPIMethods.createCheckoutSession(finalAmount, "inr")
    localStorage.setItem("url",currentUrl)
      if (!res.ok) {
        showErrorToast(res.msg)
      }
       
      setCurentUrl(currentUrl)
      setIsOpen(false);
      const result = await stripe.redirectToCheckout({
        sessionId: res.data.id,
      });
      
      if (result.error) {
        showErrorToast(result.error.message || "Failed to redirect to Stripe Checkout.");
        return 
      }
     
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 px-4 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105 flex items-center gap-2"
        >
          <Heart className="h-5 w-5 fill-current" /> 
          Donate
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">Make a Donation</DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-300 mt-2">
            Your contribution helps us continue providing quality educational content.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Label htmlFor="amount" className="text-lg font-medium text-gray-800 dark:text-gray-200">
            Choose an amount:
          </Label>
          <RadioGroup
            onValueChange={handleAmountChange}
            value={selectedAmount.toString()}
            className="flex flex-wrap gap-3"
          >
            {predefinedAmounts.map((amount) => (
              <div key={amount} className="flex items-center space-x-2">
                <RadioGroupItem value={amount.toString()} id={`amount-${amount}`} className="peer sr-only" />
                <Label
                  htmlFor={`amount-${amount}`}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer text-sm font-medium
                  hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200
                  peer-data-[state=checked]:bg-blue-500 peer-data-[state=checked]:text-white peer-data-[state=checked]:border-blue-500"
                >
                  ₹{amount} {/* Changed to Indian Rupee symbol */}
                </Label>
              </div>
            ))}
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="custom" id="amount-custom" className="peer sr-only" />
              <Label
                htmlFor="amount-custom"
                className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer text-sm font-medium
                hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200
                peer-data-[state=checked]:bg-blue-500 peer-data-[state=checked]:text-white peer-data-[state=checked]:border-blue-500"
              >
                Custom
              </Label>
            </div>
          </RadioGroup>

          {selectedAmount === 'custom' && (
            <div className="mt-4">
              <Label htmlFor="custom-amount" className="sr-only">Custom Amount</Label>
              <Input
                id="custom-amount"
                type="number"
                placeholder="Enter custom amount (INR)" 
                value={customAmount}
                onChange={handleCustomAmountChange}
                className="col-span-3 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                min="1"
                step="0.01"
              />
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)} className="flex items-center gap-1">
            <X className="h-4 w-4" /> Cancel
          </Button>
          <Button onClick={handleConfirmDonate} className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1">
            <Heart className="h-4 w-4 fill-current" /> Confirm Donation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
