import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Banknote, CreditCard, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PayoutRequestModalProps {
  creatorId: string;
  availableAmount: number;
  onClose: () => void;
  onSuccess: () => void;
}

const paymentMethods = [
  { 
    value: 'paystack', 
    label: 'Paystack', 
    icon: CreditCard,
    description: 'Direct bank transfer via Paystack' 
  },
  { 
    value: 'opay', 
    label: 'OPay', 
    icon: Banknote,
    description: 'Transfer to OPay wallet' 
  },
  { 
    value: 'flutterwave', 
    label: 'Flutterwave', 
    icon: CreditCard,
    description: 'Direct bank transfer via Flutterwave' 
  },
  { 
    value: 'bank_transfer', 
    label: 'Direct Bank Transfer', 
    icon: Building2,
    description: 'Manual bank transfer' 
  }
];

export function PayoutRequestModal({ creatorId, availableAmount, onClose, onSuccess }: PayoutRequestModalProps) {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    amount: availableAmount,
    payment_method: '',
    account_name: '',
    account_number: '',
    bank_name: '',
    bank_code: '',
    phone_number: '',
    additional_info: ''
  });

  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.payment_method) {
      toast({
        title: "Missing Information",
        description: "Please select a payment method",
        variant: "destructive"
      });
      return;
    }

    if (formData.amount < 5000) {
      toast({
        title: "Invalid Amount",
        description: "Minimum payout amount is ₦5,000",
        variant: "destructive"
      });
      return;
    }

    if (formData.amount > availableAmount) {
      toast({
        title: "Invalid Amount",
        description: "Amount exceeds available balance",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);

    try {
      // Prepare payment details based on method
      let paymentDetails: any = {};

      switch (formData.payment_method) {
        case 'paystack':
        case 'flutterwave':
        case 'bank_transfer':
          paymentDetails = {
            account_name: formData.account_name,
            account_number: formData.account_number,
            bank_name: formData.bank_name,
            bank_code: formData.bank_code
          };
          break;
        case 'opay':
          paymentDetails = {
            phone_number: formData.phone_number,
            account_name: formData.account_name
          };
          break;
      }

      if (formData.additional_info) {
        paymentDetails.additional_info = formData.additional_info;
      }

      // Create payout request
      const { error } = await supabase
        .from('payout_requests')
        .insert({
          creator_id: creatorId,
          amount_naira: formData.amount,
          payment_method: formData.payment_method,
          payment_details: paymentDetails,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Payout Request Submitted",
        description: "Your payout request has been submitted and will be processed within 3-5 business days."
      });

      onSuccess();

    } catch (error) {
      console.error('Payout request error:', error);
      toast({
        title: "Request Failed",
        description: "Failed to submit payout request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderPaymentFields = () => {
    switch (formData.payment_method) {
      case 'paystack':
      case 'flutterwave':
      case 'bank_transfer':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-streaming-text">Account Name *</Label>
                <Input
                  value={formData.account_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, account_name: e.target.value }))}
                  placeholder="Account holder name"
                  className="bg-streaming-darker border-streaming-border text-streaming-text"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-streaming-text">Account Number *</Label>
                <Input
                  value={formData.account_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, account_number: e.target.value }))}
                  placeholder="10-digit account number"
                  className="bg-streaming-darker border-streaming-border text-streaming-text"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-streaming-text">Bank Name *</Label>
                <Input
                  value={formData.bank_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, bank_name: e.target.value }))}
                  placeholder="e.g., First Bank Nigeria"
                  className="bg-streaming-darker border-streaming-border text-streaming-text"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-streaming-text">Bank Code</Label>
                <Input
                  value={formData.bank_code}
                  onChange={(e) => setFormData(prev => ({ ...prev, bank_code: e.target.value }))}
                  placeholder="e.g., 011 (optional)"
                  className="bg-streaming-darker border-streaming-border text-streaming-text"
                />
              </div>
            </div>
          </div>
        );

      case 'opay':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-streaming-text">Phone Number *</Label>
                <Input
                  value={formData.phone_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone_number: e.target.value }))}
                  placeholder="08012345678"
                  className="bg-streaming-darker border-streaming-border text-streaming-text"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-streaming-text">Account Name *</Label>
                <Input
                  value={formData.account_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, account_name: e.target.value }))}
                  placeholder="Name on OPay account"
                  className="bg-streaming-darker border-streaming-border text-streaming-text"
                  required
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-streaming-card border-streaming-border">
        <DialogHeader>
          <DialogTitle className="text-streaming-text">Request Payout</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Available Balance */}
          <Card className="bg-streaming-darker border-streaming-border">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <span className="text-streaming-muted">Available for payout:</span>
                <span className="text-xl font-bold text-green-400">
                  {formatNaira(availableAmount)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Payout Amount */}
          <div className="space-y-2">
            <Label className="text-streaming-text">Payout Amount *</Label>
            <Input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: Number(e.target.value) }))}
              min="5000"
              max={availableAmount}
              step="100"
              className="bg-streaming-darker border-streaming-border text-streaming-text"
              required
            />
            <p className="text-xs text-streaming-muted">
              Minimum payout: ₦5,000. Maximum: {formatNaira(availableAmount)}
            </p>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label className="text-streaming-text">Payment Method *</Label>
            <Select
              value={formData.payment_method}
              onValueChange={(value) => setFormData(prev => ({ ...prev, payment_method: value }))}
            >
              <SelectTrigger className="bg-streaming-darker border-streaming-border text-streaming-text">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent className="bg-streaming-card border-streaming-border">
                {paymentMethods.map((method) => {
                  const IconComponent = method.icon;
                  return (
                    <SelectItem key={method.value} value={method.value}>
                      <div className="flex items-center gap-3">
                        <IconComponent className="w-4 h-4" />
                        <div>
                          <p className="font-medium">{method.label}</p>
                          <p className="text-xs text-streaming-muted">{method.description}</p>
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Dynamic Payment Fields */}
          {renderPaymentFields()}

          {/* Additional Information */}
          <div className="space-y-2">
            <Label className="text-streaming-text">Additional Information (Optional)</Label>
            <Input
              value={formData.additional_info}
              onChange={(e) => setFormData(prev => ({ ...prev, additional_info: e.target.value }))}
              placeholder="Any special instructions..."
              className="bg-streaming-darker border-streaming-border text-streaming-text"
            />
          </div>

          {/* Processing Note */}
          <div className="p-3 bg-blue-600/20 border border-blue-600/30 rounded-lg">
            <p className="text-sm text-blue-300">
              <strong>Processing Time:</strong> Payouts are processed within 3-5 business days. 
              You'll receive an email notification when your payout is completed.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={submitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {submitting ? 'Submitting...' : 'Request Payout'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}