import { Response } from 'express';
import { SubscriptionService } from '../services/SubscriptionService';
import { PaymentService } from '../services/PaymentService';
import { ApiResponse } from '../types/api';
import { AuthRequest } from '../middleware/auth';

export class SubscriptionController {
  private subscriptionService: SubscriptionService;
  private paymentService: PaymentService;

  constructor() {
    this.subscriptionService = new SubscriptionService();
    this.paymentService = new PaymentService();
  }

  // Create new subscription (requires login)
  createSubscription = async (
    req: AuthRequest,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res
          .status(401)
          .json({ success: false, error: 'Login required for subscriptions' });
        return;
      }

      const subscriptionData = req.body;

      // Add educational logging for debugging
      console.log('📝 Creating subscription for user:', userId);
      console.log('📋 Subscription data:', subscriptionData);

      const subscription = await this.subscriptionService.createSubscription({
        ...subscriptionData,
        userId,
      });

      const response: ApiResponse = {
        success: true,
        data: subscription,
        message: 'Subscription created successfully',
      };
      res.status(201).json(response);
    } catch (error: any) {
      console.error('Create subscription error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to create subscription',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      });
    }
  };

  // NEW: Create subscription with Stripe payment setup (safe addition)
  createSubscriptionWithPayment = async (
    req: AuthRequest,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      const userEmail = req.user?.email;

      if (!userId || !userEmail) {
        res
          .status(401)
          .json({ success: false, error: 'Authentication required for subscription payments' });
        return;
      }

      const subscriptionData = req.body;

      console.log('🔄 Creating subscription with payment setup for user:', userId);
      console.log('📋 Subscription data:', subscriptionData);

      // Feature flag check - fallback to regular subscription if payment disabled
      if (process.env.ENABLE_SUBSCRIPTION_PAYMENTS !== 'true') {
        console.log('⚠️ Subscription payments disabled, falling back to regular subscription');
        return this.createSubscription(req, res);
      }

      // Step 1: Create Flora subscription (without payment)
      const floraSubscription = await this.subscriptionService.createSubscription({
        ...subscriptionData,
        userId,
      });

      // Step 2: Create Stripe subscription with payment setup
      // Use email prefix as customer name since we don't track user profiles
      const customerName = userEmail.split('@')[0] || 'Flora Customer';

      const stripeResult = await this.paymentService.createSubscriptionWithPaymentSetup({
        email: userEmail,
        name: customerName,
        subscriptionType: subscriptionData.type,
        floraSubscriptionId: floraSubscription.id,
        metadata: {
          floraUserId: userId,
          subscriptionType: subscriptionData.type,
        },
      });

      // Step 3: Update Flora subscription with Stripe subscription ID
      await this.subscriptionService.updateSubscription(floraSubscription.id, {
        stripeSubscriptionId: stripeResult.subscription.id,
      });

      const response: ApiResponse = {
        success: true,
        data: {
          subscription: floraSubscription,
          clientSecret: stripeResult.clientSecret,
          stripeSubscriptionId: stripeResult.subscription.id,
        },
        message: 'Subscription created with payment setup successfully',
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Create subscription with payment error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create subscription with payment setup',
      });
    }
  };

  // Get specific subscription
  getSubscription = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const subscription = await this.subscriptionService.getSubscription(id);

      if (!subscription || subscription.userId !== userId) {
        res.status(404).json({
          success: false,
          error: 'Subscription not found',
        });
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: subscription,
      };
      res.json(response);
    } catch (error) {
      console.error('Get subscription error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get subscription',
      });
    }
  };

  // Get user subscriptions
  getUserSubscriptions = async (
    req: AuthRequest,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const subscriptions =
        await this.subscriptionService.getSubscriptionsByUser(userId);

      const response: ApiResponse = {
        success: true,
        data: subscriptions,
      };
      res.json(response);
    } catch (error) {
      console.error('Get user subscriptions error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get subscriptions',
      });
    }
  };

  // Update subscription
  updateSubscription = async (
    req: AuthRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const updateData = req.body;

      if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      // Verify ownership
      const existing = await this.subscriptionService.getSubscription(id);
      if (!existing || existing.userId !== userId) {
        res.status(404).json({
          success: false,
          error: 'Subscription not found',
        });
        return;
      }

      const subscription = await this.subscriptionService.updateSubscription(
        id,
        updateData
      );

      const response: ApiResponse = {
        success: true,
        data: subscription,
        message: 'Subscription updated successfully',
      };
      res.json(response);
    } catch (error) {
      console.error('Update subscription error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update subscription',
      });
    }
  };

  // Resume subscription
  resumeSubscription = async (
    req: AuthRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      // Verify ownership
      const existing = await this.subscriptionService.getSubscription(id);
      if (!existing || existing.userId !== userId) {
        res.status(404).json({
          success: false,
          error: 'Subscription not found',
        });
        return;
      }

      const subscription = await this.subscriptionService.resumeSubscription(
        id
      );

      const response: ApiResponse = {
        success: true,
        data: subscription,
        message: 'Subscription resumed successfully',
      };
      res.json(response);
    } catch (error) {
      console.error('Resume subscription error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to resume subscription',
      });
    }
  };

  // Pause subscription
  pauseSubscription = async (
    req: AuthRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      // Verify ownership
      const existing = await this.subscriptionService.getSubscription(id);
      if (!existing || existing.userId !== userId) {
        res.status(404).json({
          success: false,
          error: 'Subscription not found',
        });
        return;
      }

      const subscription = await this.subscriptionService.pauseSubscription(id);

      const response: ApiResponse = {
        success: true,
        data: subscription,
        message: 'Subscription paused successfully',
      };
      res.json(response);
    } catch (error) {
      console.error('Pause subscription error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to pause subscription',
      });
    }
  };

  // Cancel subscription
  cancelSubscription = async (
    req: AuthRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      // Verify ownership
      const existing = await this.subscriptionService.getSubscription(id);
      if (!existing || existing.userId !== userId) {
        res.status(404).json({
          success: false,
          error: 'Subscription not found',
        });
        return;
      }

      const subscription = await this.subscriptionService.cancelSubscription(
        id
      );

      const response: ApiResponse = {
        success: true,
        data: subscription,
        message: 'Subscription cancelled successfully',
      };
      res.json(response);
    } catch (error) {
      console.error('Cancel subscription error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to cancel subscription',
      });
    }
  };

  // Trigger spontaneous delivery
  createSpontaneousDelivery = async (
    req: AuthRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const deliveryData = req.body;

      if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      // Verify ownership
      const existing = await this.subscriptionService.getSubscription(id);
      if (!existing || existing.userId !== userId) {
        res.status(404).json({
          success: false,
          error: 'Subscription not found',
        });
        return;
      }

      const order = await this.subscriptionService.createSpontaneousDelivery(
        id,
        deliveryData
      );

      const response: ApiResponse = {
        success: true,
        data: order,
        message: 'Spontaneous delivery scheduled successfully',
      };
      res.json(response);
    } catch (error) {
      console.error('Create spontaneous delivery error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to schedule delivery',
      });
    }
  };

  // Convenience method: Create subscription from a product page
  // This is perfect for your UI flow where users select a product and choose subscription
  createSubscriptionFromProduct = async (
    req: AuthRequest,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, error: 'Login required' });
        return;
      }

      const {
        productId,
        quantity = 1,
        subscriptionType,
        shippingAddress,
        deliveryType,
        deliveryNotes
      } = req.body;

      console.log(`🛍️ Creating subscription for product ${productId} with type ${subscriptionType}`);

      // Validate required fields
      if (!productId || !subscriptionType || !shippingAddress) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields: productId, subscriptionType, shippingAddress',
        });
        return;
      }

      // Validate shippingAddress has required fields
      const requiredAddressFields = ['firstName', 'lastName', 'street1', 'city', 'state', 'zipCode'];
      const missingFields = requiredAddressFields.filter(field => !shippingAddress[field]);
      if (missingFields.length > 0) {
        res.status(400).json({
          success: false,
          error: `Missing address fields: ${missingFields.join(', ')}`,
        });
        return;
      }

      console.log(`👤 Creating subscription for Auth0 user: ${userId}`);

      // Create subscription using simplified service method
      const subscription = await this.subscriptionService.createSubscription({
        userId,
        type: subscriptionType,
        shippingAddress,
        deliveryType,
        deliveryNotes,
        items: [{ productId, quantity }],
      });

      const response: ApiResponse = {
        success: true,
        data: subscription,
        message: 'Subscription created successfully from product',
      };
      res.status(201).json(response);
    } catch (error) {
      console.error('Create subscription from product error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create subscription from product',
      });
    }
  };
}
