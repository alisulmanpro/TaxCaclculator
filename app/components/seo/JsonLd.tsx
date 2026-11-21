/**
 * Renders structured data. `<` is escaped so text inside the data can never close the
 * script tag (see node_modules/next/dist/docs/01-app/02-guides/json-ld.md).
 */
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
