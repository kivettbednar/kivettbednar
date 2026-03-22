import {useState} from 'react'
import {definePlugin} from 'sanity'
import {
  HelpCircleIcon,
  HomeIcon,
  DocumentIcon,
  TagIcon,
  PackageIcon,
  PlugIcon,
  BulbOutlineIcon,
  CogIcon,
  CalendarIcon,
  EditIcon,
} from '@sanity/icons'
import {
  Badge,
  Box,
  Card,
  Container,
  Flex,
  Grid,
  Heading,
  Label,
  Stack,
  Tab,
  TabList,
  TabPanel,
  Text,
} from '@sanity/ui'

/* ------------------------------------------------------------------ */
/*  Shared components                                                  */
/* ------------------------------------------------------------------ */

function Tip({children}: {children: React.ReactNode}) {
  return (
    <Card tone="suggest" padding={3} radius={2}>
      <Flex gap={3} align="flex-start">
        <Text size={2}>
          <BulbOutlineIcon />
        </Text>
        <Text size={2}>{children}</Text>
      </Flex>
    </Card>
  )
}

function SectionHeading({children}: {children: React.ReactNode}) {
  return <Heading size={2}>{children}</Heading>
}

function SubHeading({children}: {children: React.ReactNode}) {
  return <Heading size={1}>{children}</Heading>
}

function TaskCard({
  icon,
  title,
  instruction,
}: {
  icon: React.ReactNode
  title: string
  instruction: string
}) {
  return (
    <Card tone="default" border padding={4} radius={2}>
      <Flex gap={3} align="flex-start">
        <Text size={3}>{icon}</Text>
        <Stack space={2}>
          <Text size={2} weight="bold">
            {title}
          </Text>
          <Text size={1} muted>
            {instruction}
          </Text>
        </Stack>
      </Flex>
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/*  Tab content                                                        */
/* ------------------------------------------------------------------ */

function QuickStartTab() {
  return (
    <Stack space={5}>
      <Stack space={3}>
        <SectionHeading>Quick Start</SectionHeading>
        <Text size={2} muted>
          Common tasks to get you started.
        </Text>
      </Stack>

      <Grid columns={[1, 1, 2]} gap={4}>
        <TaskCard
          icon={<HomeIcon />}
          title="Edit the Home Page"
          instruction="Go to Content > Site Pages > Home Page"
        />
        <TaskCard
          icon={<TagIcon />}
          title="Manage Products"
          instruction="Go to Content > Store Management > All Products"
        />
        <TaskCard
          icon={<PackageIcon />}
          title="Check Orders"
          instruction="Go to Content > Orders > All Orders"
        />
        <TaskCard
          icon={<CogIcon />}
          title="Update Navigation"
          instruction="Go to Content > Settings > Navigation"
        />
        <TaskCard
          icon={<EditIcon />}
          title="Change Button Text"
          instruction="Go to Content > Settings > UI Text"
        />
        <TaskCard
          icon={<CalendarIcon />}
          title="Add an Event"
          instruction="Go to Content > Events &amp; Content > Events"
        />
      </Grid>
    </Stack>
  )
}

function PagesTab() {
  return (
    <Stack space={5}>
      <Stack space={3}>
        <SectionHeading>Site Pages</SectionHeading>
        <Text size={2} muted>
          Seven pages control the main sections of the site. Each has a single
          document you can edit directly.
        </Text>
      </Stack>

      <Card border padding={4} radius={2}>
        <Stack space={3}>
          {[
            ['Home Page', 'Hero section, featured content, and visibility toggles for each section'],
            ['Shows Page', 'Header and intro for the events listing'],
            ['Lessons Page', 'Music lessons info and booking details'],
            ['Contact Page', 'Contact form settings and info'],
            ['Setlist Page', 'Setlist display settings'],
            ['Merch Page', 'Store header and layout'],
            ['Order Confirmation Page', 'Post-checkout thank-you page'],
          ].map(([name, desc]) => (
            <Text size={2} key={name}>
              <strong>{name}</strong> &mdash; {desc}
            </Text>
          ))}
        </Stack>
      </Card>

      <Tip>
        The Home Page has visibility toggles that let you show or hide entire
        sections (hero, events, testimonials, etc.) without deleting any content.
      </Tip>
    </Stack>
  )
}

function StoreTab() {
  return (
    <Stack space={5}>
      <Stack space={3}>
        <SectionHeading>Store</SectionHeading>
        <Text size={2} muted>
          Products, collections, promo codes, and checkout settings.
        </Text>
      </Stack>

      {/* Products */}
      <Card border padding={4} radius={2}>
        <Stack space={3}>
          <SubHeading>Products</SubHeading>
          <Text size={2}>
            Each product has a title, slug, description, images, price, category,
            and optional variants (size, color, etc.).
          </Text>
          <Text size={2}>
            <strong>Gelato Product UID:</strong> For print-on-demand items, paste
            the UID from your Gelato dashboard. Use <em>Verify in Gelato</em> to
            confirm it exists.
          </Text>
          <Text size={2}>
            <strong>Production Cost:</strong> Enter the cost in cents. The margin
            display automatically shows your profit with color coding: green
            (healthy), yellow (low, under 20%), red (losing money).
          </Text>
          <Text size={2}>
            <strong>Inventory:</strong> Enable &quot;Track Inventory&quot; to use
            stock quantities. Set to -1 for unlimited / made-to-order. The sidebar
            has quick filters for Featured, On Sale, Low Stock, and Out of Stock.
          </Text>
        </Stack>
      </Card>

      {/* Collections */}
      <Card border padding={4} radius={2}>
        <Stack space={3}>
          <SubHeading>Product Collections</SubHeading>
          <Text size={2}>
            Group products into collections for the storefront. Drag to reorder.
          </Text>
        </Stack>
      </Card>

      {/* Promo Codes */}
      <Card border padding={4} radius={2}>
        <Stack space={3}>
          <SubHeading>Promo Codes</SubHeading>
          <Text size={2}>
            Create discount codes with percentage or fixed-amount discounts. Codes
            can be active or inactive, and usage counts are tracked automatically
            at checkout.
          </Text>
        </Stack>
      </Card>

      {/* Checkout Settings */}
      <Card border padding={4} radius={2}>
        <Stack space={3}>
          <SubHeading>Checkout Settings</SubHeading>
          <Text size={2}>
            Configure shipping options, tax settings, and other store-wide
            checkout preferences.
          </Text>
        </Stack>
      </Card>

      <Tip>
        All prices are stored in cents to keep math exact. Enter 2500 for $25.00,
        999 for $9.99, etc.
      </Tip>
    </Stack>
  )
}

function OrdersTab() {
  const statuses: {label: string; tone: 'caution' | 'primary' | 'suggest' | 'positive' | 'neutral' | 'critical'; desc: string}[] = [
    {label: 'Pending', tone: 'caution', desc: 'Payment received, awaiting fulfillment submission'},
    {label: 'Submitted', tone: 'primary', desc: 'Sent to Gelato for fulfillment'},
    {label: 'In Production', tone: 'primary', desc: 'Gelato is printing and producing the items'},
    {label: 'Shipped', tone: 'suggest', desc: 'Carrier has the package (tracking info appears)'},
    {label: 'Delivered', tone: 'positive', desc: 'Customer received the order'},
    {label: 'Canceled', tone: 'neutral', desc: 'Order was canceled'},
    {label: 'Failed', tone: 'critical', desc: 'Something went wrong'},
    {label: 'Gelato Failed', tone: 'critical', desc: 'Fulfillment submission failed (can be retried)'},
  ]

  return (
    <Stack space={5}>
      <Stack space={3}>
        <SectionHeading>Orders</SectionHeading>
        <Text size={2} muted>
          Orders are created automatically when a customer completes checkout.
        </Text>
      </Stack>

      {/* Status lifecycle */}
      <Card border padding={4} radius={2}>
        <Stack space={3}>
          <SubHeading>Status Lifecycle</SubHeading>
          {statuses.map(({label, tone, desc}) => (
            <Flex key={label} gap={3} align="center">
              <Badge tone={tone}>{label}</Badge>
              <Text size={2}>{desc}</Text>
            </Flex>
          ))}
        </Stack>
      </Card>

      {/* Actions */}
      <Card border padding={4} radius={2}>
        <Stack space={3}>
          <SubHeading>Order Actions</SubHeading>
          <Text size={2}>
            <strong>Cancel Order:</strong> Available on active orders. Sends a
            cancel request to Gelato and updates the status. Orders already in
            production may not be cancelable.
          </Text>
          <Text size={2}>
            <strong>Retry Fulfillment:</strong> Only appears on
            &quot;Gelato Failed&quot; orders. Re-submits the order for production.
            Check the error message to understand what went wrong.
          </Text>
        </Stack>
      </Card>

      {/* External Links */}
      <Card border padding={4} radius={2}>
        <Stack space={3}>
          <SubHeading>External Links</SubHeading>
          <Text size={2}>
            <strong>Stripe Session ID:</strong> Click &quot;Open in Stripe
            Dashboard&quot; to view payment details, issue refunds, or check for
            disputes.
          </Text>
          <Text size={2}>
            <strong>Tracking URL:</strong> When a shipment has tracking, click
            &quot;Track Shipment&quot; to open the carrier&apos;s tracking page.
          </Text>
        </Stack>
      </Card>

      <Tip>
        Use the sidebar filters to quickly find orders by status. The
        &quot;Gelato Failed&quot; filter is the first place to check when
        troubleshooting fulfillment issues.
      </Tip>
    </Stack>
  )
}

function IntegrationsTab() {
  return (
    <Stack space={5}>
      <Stack space={3}>
        <SectionHeading>Integrations</SectionHeading>
        <Text size={2} muted>
          How payments, fulfillment, and email work together.
        </Text>
      </Stack>

      <Card border padding={4} radius={2}>
        <Stack space={3}>
          <SubHeading>Stripe (Payments)</SubHeading>
          <Text size={2}>
            When a customer checks out, the site creates a Stripe payment session.
            After payment succeeds, an order is automatically created here and
            fulfillment begins. Manage refunds and disputes in the{' '}
            <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer">
              Stripe Dashboard
            </a>.
          </Text>
        </Stack>
      </Card>

      <Card border padding={4} radius={2}>
        <Stack space={3}>
          <SubHeading>Gelato (Print-on-Demand)</SubHeading>
          <Text size={2}>
            Products with a Gelato Product UID are automatically sent to Gelato
            for printing, packing, and shipping after checkout. Status updates
            flow back automatically and update the order.
          </Text>
          <Text size={2}>
            If submission fails, the order moves to &quot;Gelato Failed&quot;
            status. Common causes: invalid Product UID, artwork issues, or
            temporary service outages. Use the Retry action to resubmit.
          </Text>
        </Stack>
      </Card>

      <Card border padding={4} radius={2}>
        <Stack space={3}>
          <SubHeading>Resend (Email)</SubHeading>
          <Text size={2}>
            Order confirmations and shipping notifications are sent automatically
            via Resend. Email templates are managed in code, not in the Studio.
          </Text>
        </Stack>
      </Card>
    </Stack>
  )
}

function TipsTab() {
  return (
    <Stack space={5}>
      <Stack space={3}>
        <SectionHeading>Tips &amp; Tricks</SectionHeading>
        <Text size={2} muted>
          Useful features to help you get the most out of the Studio.
        </Text>
      </Stack>

      <Tip>
        <strong>Publishing:</strong> Changes are not live until you click
        Publish. You can make draft edits and preview them before going live.
      </Tip>

      <Tip>
        <strong>Live Preview:</strong> Use the Live Preview tab to see your edits
        in real-time on the actual site layout before publishing.
      </Tip>

      <Tip>
        <strong>Image Hotspots:</strong> When uploading images, click the
        crop/hotspot tool to set the focal point. This ensures images look good at
        every screen size.
      </Tip>

      <Tip>
        <strong>Unsplash:</strong> When adding images, you can search Unsplash
        directly from the upload dialog for free stock photos.
      </Tip>

      <Tip>
        <strong>Prices in Cents:</strong> All prices are stored in cents to keep
        math exact. Enter 2500 for $25.00, 999 for $9.99.
      </Tip>

      <Tip>
        <strong>UI Text:</strong> Nearly every user-facing label is editable in
        Settings &gt; UI Text. Check there before requesting a code change.
      </Tip>
    </Stack>
  )
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

type TabId = 'quickstart' | 'pages' | 'store' | 'orders' | 'integrations' | 'tips'

const TABS: {id: TabId; label: string; icon: React.ReactNode}[] = [
  {id: 'quickstart', label: 'Quick Start', icon: <HomeIcon />},
  {id: 'pages', label: 'Pages', icon: <DocumentIcon />},
  {id: 'store', label: 'Store', icon: <TagIcon />},
  {id: 'orders', label: 'Orders', icon: <PackageIcon />},
  {id: 'integrations', label: 'Integrations', icon: <PlugIcon />},
  {id: 'tips', label: 'Tips', icon: <BulbOutlineIcon />},
]

function AdminGuide() {
  const [activeTab, setActiveTab] = useState<TabId>('quickstart')

  return (
    <Box padding={5} style={{overflowY: 'auto', height: '100%'}}>
      <Container width={2}>
        <Stack space={5}>
          <Stack space={3}>
            <Heading size={4}>Admin Guide</Heading>
            <Text size={2} muted>
              Everything you need to manage kivettbednar.com from this Studio.
            </Text>
          </Stack>

          <Card borderBottom>
            <TabList space={1}>
              {TABS.map(({id, label, icon}) => (
                <Tab
                  key={id}
                  id={`tab-${id}`}
                  aria-controls={`panel-${id}`}
                  label={label}
                  icon={icon}
                  onClick={() => setActiveTab(id)}
                  selected={activeTab === id}
                />
              ))}
            </TabList>
          </Card>

          {activeTab === 'quickstart' && (
            <TabPanel id="panel-quickstart" aria-labelledby="tab-quickstart">
              <QuickStartTab />
            </TabPanel>
          )}
          {activeTab === 'pages' && (
            <TabPanel id="panel-pages" aria-labelledby="tab-pages">
              <PagesTab />
            </TabPanel>
          )}
          {activeTab === 'store' && (
            <TabPanel id="panel-store" aria-labelledby="tab-store">
              <StoreTab />
            </TabPanel>
          )}
          {activeTab === 'orders' && (
            <TabPanel id="panel-orders" aria-labelledby="tab-orders">
              <OrdersTab />
            </TabPanel>
          )}
          {activeTab === 'integrations' && (
            <TabPanel id="panel-integrations" aria-labelledby="tab-integrations">
              <IntegrationsTab />
            </TabPanel>
          )}
          {activeTab === 'tips' && (
            <TabPanel id="panel-tips" aria-labelledby="tab-tips">
              <TipsTab />
            </TabPanel>
          )}
        </Stack>
      </Container>
    </Box>
  )
}

export const adminGuideTool = definePlugin({
  name: 'admin-guide',
  tools: [
    {
      name: 'admin-guide',
      title: 'Admin Guide',
      icon: HelpCircleIcon,
      component: AdminGuide,
    },
  ],
})
