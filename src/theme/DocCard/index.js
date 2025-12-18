/**
 * Override Docusaurus DocCard to remove icon prefixes (📄️, 🗃️, 🔗).
 * We keep the same structure and rely on global CSS for styling.
 */
import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {
  useDocById,
  findFirstSidebarItemLink,
} from '@docusaurus/plugin-content-docs/client';
import {usePluralForm} from '@docusaurus/theme-common';
import {translate} from '@docusaurus/Translate';
import Heading from '@theme/Heading';

function useCategoryItemsPlural() {
  const {selectMessage} = usePluralForm();
  return (count) =>
    selectMessage(
      count,
      translate(
        {
          message: '1 item|{count} items',
          id: 'theme.docs.DocCard.categoryDescription.plurals',
          description:
            'Default description for a category card in the generated index about how many items this category includes',
        },
        {count},
      ),
    );
}

function CardContainer({className, href, children}) {
  return (
    <Link href={href} className={clsx('card padding--lg', className)}>
      {children}
    </Link>
  );
}

function CardLayout({className, href, title, description}) {
  return (
    <CardContainer href={href} className={className}>
      <Heading as="h2" className="text--truncate" title={title}>
        {title}
      </Heading>
      {description && (
        <p className="text--truncate" title={description}>
          {description}
        </p>
      )}
    </CardContainer>
  );
}

function CardCategory({item}) {
  const href = findFirstSidebarItemLink(item);
  const categoryItemsPlural = useCategoryItemsPlural();
  // Unexpected: categories that don't have a link have been filtered upfront
  if (!href) {
    return null;
  }
  return (
    <CardLayout
      className={item.className}
      href={href}
      title={item.label}
      description={item.description ?? categoryItemsPlural(item.items.length)}
    />
  );
}

function CardLink({item}) {
  const doc = useDocById(item.docId ?? undefined);
  return (
    <CardLayout
      className={item.className}
      href={item.href}
      title={item.label}
      description={item.description ?? doc?.description}
    />
  );
}

export default function DocCard({item}) {
  switch (item.type) {
    case 'link':
      return <CardLink item={item} />;
    case 'category':
      return <CardCategory item={item} />;
    default:
      throw new Error(`unknown item type ${JSON.stringify(item)}`);
  }
}

