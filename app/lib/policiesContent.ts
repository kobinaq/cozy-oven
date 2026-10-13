export type PolicySection = {
  id: string;
  title: string;
  intro?: string;
  blocks: Array<{
    heading?: string;
    paragraphs?: string[];
    bullets?: string[];
  }>;
};

export const policiesIntro =
  "Please read our ordering policies carefully before placing your order. These guidelines help us maintain the quality of our products, keep delivery costs affordable, and give every customer a smooth experience. Thank you for choosing Cozy Oven!";

export const policiesClosing =
  "We appreciate your understanding and cooperation. These policies help us serve you better while maintaining the quality and care you expect from Cozy Oven. Thank you for choosing Cozy Oven — made for cozy moments.";

export const policySections: PolicySection[] = [
  {
    id: "operational-hours",
    title: "1. Operational hours",
    blocks: [
      {
        bullets: [
          "Business hours: Monday to Friday, 8:00 AM – 6:00 PM.",
          "Baking and delivery days: Tuesdays and Thursdays.",
          "To keep delivery costs affordable in Accra, we bake in bulk and dispatch orders on our scheduled baking days.",
        ],
      },
    ],
  },
  {
    id: "order-processing-delivery",
    title: "2. Order processing & delivery",
    blocks: [
      {
        heading: "For deliveries within Accra",
        bullets: [
          "Orders are processed and delivered between 12:00 PM and 6:00 PM on Tuesdays and Thursdays.",
          "Delivery times depend on your location relative to our dispatch point in Tema Community 22, as well as traffic, weather conditions, and road accessibility.",
          "Orders placed after 9:00 AM on a baking day will be processed for the next scheduled dispatch day.",
          "Orders placed on non-baking days (Monday, Wednesday, Friday, Saturday, or Sunday) will be processed on the next scheduled baking day, unless otherwise communicated by our customer service team.",
          "Please note that our delivery window is between 12:00 PM and 6:00 PM. While we do our best to deliver within this period, your exact arrival time may vary.",
        ],
      },
      {
        heading: "For deliveries outside Accra",
        bullets: [
          "Orders are dispatched from our bakery and typically take 24 hours to arrive at the designated bus station.",
          "Customers are responsible for collecting their orders from the agreed bus station.",
          "Please ensure you are available to collect your order once you receive confirmation that it has arrived.",
        ],
      },
    ],
  },
  {
    id: "order-placement-changes",
    title: "3. Order placement & changes",
    blocks: [
      {
        bullets: [
          "Choose carefully: Please select either Pickup or Delivery when placing your order. If you need to change your selection after placing your order, a GHS 50 change fee applies. This fee is non-refundable.",
          "No customizations: We are unable to accommodate customizations outside the options available on our menu.",
          "Adding a card: Adding a greeting card to a package that is not originally sold as a gift package costs an additional GHS 20.",
          "Bulk orders: Orders above GHS 1,000 qualify for a 10% discount, subject to confirmation by our customer service team. Apply discount code BLK10 at checkout.",
        ],
      },
    ],
  },
  {
    id: "order-updates-rescheduling",
    title: "4. Order updates & rescheduling",
    blocks: [
      {
        heading: "Requesting changes to your order",
        bullets: [
          "On baking days, you may request an update or change within 5 minutes of placing your order.",
          "Requests made after this period may attract an additional charge and will depend on the stage of processing your order has reached.",
          "Once your order has entered production or dispatch, some changes may no longer be possible.",
          "Please contact our customer service team as soon as possible if you need to make a change.",
        ],
      },
      {
        heading: "Rescheduling your order",
        bullets: [
          "Rescheduling attracts a GHS 50 fee and is subject to the current status of your order.",
          "Rescheduling requests must be made within 7 days of your original delivery date.",
          "After this 7-day period, we cannot guarantee that your order can be rescheduled. You will need to arrange pickup or express delivery at your own expense.",
          "Please keep track of your agreed delivery date, as we cannot guarantee reminder notifications beyond this period.",
        ],
      },
    ],
  },
  {
    id: "missed-deliveries",
    title: "5. Missed deliveries & failed pickups",
    blocks: [
      {
        paragraphs: [
          "We understand that unexpected situations can happen. However, missed deliveries require additional handling, repackaging, and scheduling.",
          "Please help us deliver successfully by keeping your phone accessible and being available at your agreed delivery or pickup time.",
        ],
        bullets: [
          "Rider waiting time: Riders can wait for a maximum of 10 minutes at your delivery location.",
          "Contact attempts: If we cannot reach you, we will attempt to contact you by phone call, SMS, or WhatsApp.",
          "Missed delivery: If your order cannot be delivered because you are unavailable or unreachable, a GHS 50 return-to-bakery and rescheduling fee applies.",
          "Redelivery: The full delivery fee will apply again when your order is sent out for a second delivery.",
          "Pickup arrangements: Depending on the situation, you may arrange to collect your order from the bakery or reschedule delivery.",
        ],
      },
      {
        paragraphs: [
          "Please note that a failed delivery or pickup may require us to remake or repackage your order and prepare new delivery documentation. These additional steps take time and resources, which is why the applicable fees are necessary.",
        ],
      },
    ],
  },
  {
    id: "complaints",
    title: "6. Complaints & order resolution",
    blocks: [
      {
        paragraphs: [
          "Your satisfaction matters to us, and we want you to receive your order in the best possible condition.",
        ],
        bullets: [
          "Check your order immediately: Please open your package as soon as you receive it and confirm that all items are present and in good condition.",
          "Report issues promptly: If anything is missing, incorrect, damaged, or otherwise not as expected, please contact our customer service team within 1 hour of receiving your order.",
          "After the 1-hour window: We may be unable to investigate or resolve complaints reported after this period, as it becomes more difficult to verify the condition of the order at the time of delivery.",
        ],
      },
      {
        paragraphs: [
          "When contacting us about an issue, please provide your order details and clear photos where applicable so we can assess the situation and advise you on the next steps.",
        ],
      },
    ],
  },
];

/** Short summary shown on checkout, kept in sync with the full policies page. */
export const checkoutDeliveryPolicyPoints = [
  "Orders for Accra are baked and delivered on Tuesdays and Thursdays between 12:00 PM and 6:00 PM.",
  "Orders placed after 9:00 AM on a baking day are processed for the next scheduled dispatch day.",
  "Keep your phone nearby. Riders wait up to 10 minutes. A missed delivery attracts a GHS 50 return-to-bakery and rescheduling fee, and redelivery requires the full delivery fee again.",
  "Changing between pickup and delivery after ordering attracts a non-refundable GHS 50 fee.",
];
