import React, { useState, FormEvent } from "react";
import { CreditCard, ShieldCheck, AlertCircle, RefreshCw, Check, Lock, DollarSign } from "lucide-react";

interface PaymentsPortalProps {
  currentPlan: "FREE" | "BUSINESS" | "ENTERPRISE";
  onUpgradePlan: (plan: "FREE" | "BUSINESS" | "ENTERPRISE") => void;
  onAddLog: (level: "INFO" | "WARN" | "SUCCESS" | "ERROR", message: string) => void;
}

export default function PaymentsPortal({ currentPlan, onUpgradePlan, onAddLog }: PaymentsPortalProps) {
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [selectedPlanToUnlock, setSelectedPlanToUnlock] = useState<"BUSINESS" | "ENTERPRISE" | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("0");
  
  // Checkout Form Fields
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  
  // Processing States
  const [isProcessing, setIsProcessing] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);

  // Luhn check for card validation
  const validateCardWithLuhn = (num: string) => {
    const cleaned = num.replace(/\s+/g, "");
    if (!/^\d{13,19}$/.test(cleaned)) return false;
    let sum = 0;
    let shouldDouble = false;
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned.charAt(i));
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  };

  const handleOpenCheckout = (plan: "BUSINESS" | "ENTERPRISE", price: string) => {
    setSelectedPlanToUnlock(plan);
    setPaymentAmount(price);
    setSuccessReceipt(null);
    setErrorText(null);
    setCardName("");
    setCardNumber("");
    setCardExpiry("");
    setCardCvc("");
    setShowCheckoutForm(true);
  };

  const handleProcessPayment = (e: FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorText(null);
    
    onAddLog("INFO", `Contacting secure banking node to charge $${paymentAmount} USD via JS payments...`);

    setTimeout(() => {
      // Validate with client-side algorithm (Luhn validation)
      const isCardValid = validateCardWithLuhn(cardNumber);
      if (!isCardValid) {
        setErrorText("Invalid Card Checksum (Luhn check failed). Try a real card syntax or valid testing digits.");
        setIsProcessing(false);
        onAddLog("ERROR", "JS Payments Portal: Luhn checksum signature invalid. Transaction aborted.");
        return;
      }

      if (cardCvc.length < 3 || cardExpiry.length < 4) {
        setErrorText("Incomplete card properties. Provide a valid Expiration date and CVC code.");
        setIsProcessing(false);
        onAddLog("ERROR", "JS Payments Portal: Incomplete CVV/Expiration fields.");
        return;
      }

      // Completed successfully!
      const receiptId = `REC-GATE-${Math.floor(100000 + Math.random() * 900000)}-DYABLO`;
      setSuccessReceipt(receiptId);
      setIsProcessing(false);
      
      if (selectedPlanToUnlock) {
        onUpgradePlan(selectedPlanToUnlock);
        onAddLog("SUCCESS", `Transaction Approved! Receipt ${receiptId} issued. Subscribed to ${selectedPlanToUnlock} Plan.`);
      }
    }, 1500);
  };

  return (
    <div id="payments-portal-container" className="bg-gray-900/40 border border-gray-800 rounded-xl p-4 space-y-4 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-gray-800 pb-2">
        <div className="flex items-center gap-2 text-white font-bold tracking-wider">
          <CreditCard size={16} className="text-purple-400" />
          <span>DYABLO SUBSCRIPTION TERMINAL</span>
        </div>
        <span className="text-[10px] text-cyan-400 font-bold bg-cyan-950/40 px-2 py-0.5 border border-cyan-500/10 rounded">
          ACTIVE: {currentPlan} PLAN
        </span>
      </div>

      {/* Subscription cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {/* Plan 1 */}
        <div className={`p-3 rounded-lg border flex flex-col justify-between space-y-2 ${currentPlan === "FREE" ? "bg-cyan-950/20 border-cyan-500/40" : "bg-gray-950/60 border-gray-850"}`}>
          <div>
            <div className="text-[9px] text-gray-500 uppercase">EVALUATION CORE</div>
            <div className="text-[11px] font-bold text-white">Abyssal Free</div>
            <div className="text-xs font-semibold text-cyan-400 mt-1">$0 / mo</div>
          </div>
          {currentPlan === "FREE" ? (
            <div className="text-[9px] text-center bg-cyan-950/40 py-1 border border-cyan-500/20 text-cyan-400 font-bold rounded">ACTIVE</div>
          ) : (
            <button 
              onClick={() => { onUpgradePlan("FREE"); onAddLog("INFO", "Downgraded license to Free evaluation core."); }}
              className="text-[9px] py-1 bg-gray-900 border border-gray-800 hover:border-gray-700 text-gray-400 rounded transition"
            >
              Downgrade
            </button>
          )}
        </div>

        {/* Plan 2 */}
        <div className={`p-3 rounded-lg border flex flex-col justify-between space-y-2 ${currentPlan === "BUSINESS" ? "bg-purple-950/20 border-purple-500/40" : "bg-gray-950/60 border-gray-850"}`}>
          <div>
            <div className="text-[9px] text-gray-500 uppercase">STUDIO DESIGN</div>
            <div className="text-[11px] font-bold text-white">Business Hydro</div>
            <div className="text-xs font-semibold text-purple-400 mt-1">$249 / mo</div>
          </div>
          {currentPlan === "BUSINESS" ? (
            <div className="text-[9px] text-center bg-purple-950/40 py-1 border border-purple-500/20 text-purple-400 font-bold rounded">ACTIVE</div>
          ) : (
            <button 
              onClick={() => handleOpenCheckout("BUSINESS", "249.00")}
              className="text-[9px] py-1 bg-gradient-to-r from-purple-900/40 to-pink-900/40 hover:from-purple-900/60 hover:to-pink-900/60 border border-purple-500/20 text-purple-300 rounded font-bold transition"
            >
              Upgrade
            </button>
          )}
        </div>

        {/* Plan 3 */}
        <div className={`p-3 rounded-lg border flex flex-col justify-between space-y-2 ${currentPlan === "ENTERPRISE" ? "bg-amber-950/20 border-amber-500/40" : "bg-gray-950/60 border-gray-850"}`}>
          <div>
            <div className="text-[9px] text-gray-500 uppercase">INFINITE GPGPU</div>
            <div className="text-[11px] font-bold text-white">Enterprise Abyssal</div>
            <div className="text-xs font-semibold text-amber-400 mt-1">$1,199 / mo</div>
          </div>
          {currentPlan === "ENTERPRISE" ? (
            <div className="text-[9px] text-center bg-amber-950/40 py-1 border border-amber-500/20 text-amber-400 font-bold rounded">ACTIVE</div>
          ) : (
            <button 
              onClick={() => handleOpenCheckout("ENTERPRISE", "1199.00")}
              className="text-[9px] py-1 bg-gradient-to-r from-amber-900/40 to-orange-900/40 hover:from-amber-900/60 hover:to-orange-900/60 border border-amber-500/20 text-amber-300 rounded font-bold transition"
            >
              Subscribe
            </button>
          )}
        </div>
      </div>

      {/* Popover Payment Portal */}
      {showCheckoutForm && (
        <div className="border border-gray-850 bg-gray-950 rounded-xl p-3.5 space-y-3 animate-fade-in relative">
          <button 
            onClick={() => setShowCheckoutForm(false)}
            className="absolute top-2.5 right-2.5 text-gray-500 hover:text-white"
          >
            ✕
          </button>

          {successReceipt ? (
            <div className="text-center space-y-2.5 py-2 animate-fade-in">
              <div className="h-8 w-8 mx-auto bg-emerald-950 border border-emerald-500/50 rounded-full flex items-center justify-center text-emerald-400">
                <Check size={16} />
              </div>
              <div>
                <div className="text-[11px] font-bold text-white uppercase tracking-wider">TRANSACTION COMPLETE</div>
                <p className="text-[10px] text-gray-400 mt-0.5">Your subscription was verified successfully.</p>
              </div>
              <div className="bg-gray-900/70 p-2.5 rounded border border-gray-850 text-left text-[9px] space-y-1 text-gray-300">
                <div><span className="text-gray-500">Receipt ID:</span> <span className="text-cyan-400 font-mono font-bold">{successReceipt}</span></div>
                <div><span className="text-gray-500">Plan Status:</span> <span className="text-purple-400 uppercase font-bold">{selectedPlanToUnlock} APPROVED</span></div>
                <div><span className="text-gray-500">Amount Charged:</span> <span className="text-white">${paymentAmount} USD</span></div>
              </div>
              <button 
                onClick={() => setShowCheckoutForm(false)}
                className="w-full py-1 bg-cyan-500 text-gray-950 font-bold text-[10px] rounded uppercase hover:bg-cyan-400 transition"
              >
                Close Checkout
              </button>
            </div>
          ) : (
            <form onSubmit={handleProcessPayment} className="space-y-3">
              <div className="bg-purple-950/20 border border-purple-500/20 p-2 rounded text-purple-400 text-[10px] flex items-center gap-1.5">
                <Lock size={12} className="animate-pulse" />
                <span>SECURE CHECKOUT: <strong className="text-white">${paymentAmount} USD</strong></span>
              </div>

              {errorText && (
                <div className="bg-red-950/40 border border-red-500/20 p-2 rounded text-red-400 text-[9px] flex items-center gap-1.5">
                  <AlertCircle size={12} />
                  <span>{errorText}</span>
                </div>
              )}

              <div className="space-y-2 text-[10px]">
                <div>
                  <label className="text-gray-500 block mb-0.5 uppercase text-[9px]">Cardholder Name</label>
                  <input 
                    type="text" 
                    required
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="e.g. John Dyablo Knocks"
                    className="w-full bg-gray-900 border border-gray-800 px-2 py-1.5 rounded text-gray-300 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-gray-500 block mb-0.5 uppercase text-[9px]">Credit Card Number (Luhn checksum)</label>
                  <input 
                    type="text" 
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="e.g. 4532718293812309 (Test Visa)"
                    className="w-full bg-gray-900 border border-gray-800 px-2 py-1.5 rounded text-gray-300 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-gray-500 block mb-0.5 uppercase text-[9px]">Expiration (MMYY)</label>
                    <input 
                      type="text" 
                      required
                      maxLength={4}
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="1229"
                      className="w-full bg-gray-900 border border-gray-800 px-2 py-1.5 rounded text-gray-300 text-center focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-gray-500 block mb-0.5 uppercase text-[9px]">CVV / CVC Code</label>
                    <input 
                      type="password" 
                      required
                      maxLength={4}
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      placeholder="382"
                      className="w-full bg-gray-900 border border-gray-800 px-2 py-1.5 rounded text-gray-300 text-center focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button 
                  type="button" 
                  onClick={() => setShowCheckoutForm(false)}
                  className="flex-1 py-1.5 bg-gray-900 border border-gray-850 text-gray-400 hover:text-white rounded transition text-[10px]"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isProcessing}
                  className="flex-1 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded transition text-[10px] flex items-center justify-center gap-1"
                >
                  {isProcessing ? <RefreshCw size={11} className="animate-spin" /> : <Lock size={10} />}
                  {isProcessing ? "Processing..." : "Submit Payment"}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
