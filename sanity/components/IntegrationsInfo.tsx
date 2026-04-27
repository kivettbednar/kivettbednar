import {Box, Card, Container, Flex, Heading, Stack, Text} from '@sanity/ui'
import {InfoOutlineIcon, ChevronRightIcon} from '@sanity/icons'

/**
 * Static info panel explaining which integrations are configured outside
 * the Sanity Studio (in Vercel environment variables) and how the owner
 * should manage them. Surfaced under Settings → External Integrations.
 */
export function IntegrationsInfo() {
  return (
    <Container width={1} padding={4}>
      <Stack space={5}>
        <Stack space={3}>
          <Flex align="center" gap={2}>
            <Text size={3}>
              <InfoOutlineIcon />
            </Text>
            <Heading size={2}>External Integrations</Heading>
          </Flex>
          <Text size={2} muted>
            These services power your store but are <strong>not edited inside Sanity</strong>.
            They&rsquo;re configured once in your Vercel environment variables —
            usually during the initial setup — and run silently in the background.
          </Text>
        </Stack>

        <Card border padding={4} radius={2} tone="primary">
          <Stack space={3}>
            <Heading size={1}>Stripe (payments)</Heading>
            <Text size={2}>
              Customer checkouts and payment processing. View payments, refunds, and
              disputes in the Stripe dashboard.
            </Text>
            <Text size={1} muted>
              Configured via <code>STRIPE_SECRET_KEY</code>,&nbsp;
              <code>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code>,&nbsp;
              <code>STRIPE_WEBHOOK_SECRET</code>, and&nbsp;
              <code>STRIPE_ENABLED</code> in Vercel.
            </Text>
            <Box>
              <Text size={2}>
                <a
                  href="https://dashboard.stripe.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{textDecoration: 'none'}}
                >
                  Open Stripe dashboard <ChevronRightIcon />
                </a>
              </Text>
            </Box>
          </Stack>
        </Card>

        <Card border padding={4} radius={2} tone="positive">
          <Stack space={3}>
            <Heading size={1}>Gelato (print-on-demand fulfillment)</Heading>
            <Text size={2}>
              Products with a Gelato Product UID are automatically sent to Gelato
              for printing, packing, and shipping after checkout. Status updates
              flow back automatically and update the matching order in this Studio.
            </Text>
            <Text size={1} muted>
              Configured via <code>GELATO_API_KEY</code> and&nbsp;
              <code>GELATO_WEBHOOK_SECRET</code> in Vercel.
            </Text>
            <Box>
              <Text size={2}>
                <a
                  href="https://dashboard.gelato.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{textDecoration: 'none'}}
                >
                  Open Gelato dashboard <ChevronRightIcon />
                </a>
              </Text>
            </Box>
          </Stack>
        </Card>

        <Card border padding={4} radius={2} tone="caution">
          <Stack space={3}>
            <Heading size={1}>Resend (email)</Heading>
            <Text size={2}>
              Order confirmations, shipping updates, and contact-form notifications
              are sent automatically via Resend. Email <em>subject lines</em> and
              your <em>sign-off name</em> live in <strong>Settings → Store Settings → Email</strong>.
            </Text>
            <Text size={1} muted>
              Configured via <code>RESEND_API_KEY</code> in Vercel. Sender email
              address must be verified in Resend.
            </Text>
            <Box>
              <Text size={2}>
                <a
                  href="https://resend.com/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{textDecoration: 'none'}}
                >
                  Open Resend dashboard <ChevronRightIcon />
                </a>
              </Text>
            </Box>
          </Stack>
        </Card>

        <Card border padding={4} radius={2} tone="transparent">
          <Stack space={3}>
            <Heading size={1}>Need to change a key?</Heading>
            <Text size={2}>
              API keys live in the Vercel project as environment variables. Updating
              them requires Vercel access — contact your developer or visit the&nbsp;
              <a
                href="https://vercel.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
              >
                Vercel dashboard
              </a>{' '}
              if you have permissions. After changing, redeploy for the new keys to
              take effect.
            </Text>
          </Stack>
        </Card>
      </Stack>
    </Container>
  )
}
