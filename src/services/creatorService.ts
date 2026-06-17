import {
  creators,
  sponsorshipPackages,
  collaborationCases,
  type Creator,
  type SponsorshipPackage,
  type CollaborationCase,
  type ListingType,
  type Platform,
} from './mockData';

function delay<T>(data: T, ms: number = 300): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), ms);
  });
}

export interface CreatorsFilter {
  keyword?: string;
  categories?: string[];
  platforms?: Platform[];
  minFollowers?: number;
  maxFollowers?: number;
  minEngagementRate?: number;
  verified?: boolean;
}

export interface CreatorsPagination {
  page?: number;
  pageSize?: number;
}

export interface CreatorsResult {
  list: Creator[];
  total: number;
  page: number;
  pageSize: number;
}

export function getCreators(
  filter?: CreatorsFilter,
  pagination: CreatorsPagination = {},
): Promise<CreatorsResult> {
  let filtered = [...creators];

  if (filter) {
    if (filter.keyword) {
      const kw = filter.keyword.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(kw) ||
          c.bio.toLowerCase().includes(kw) ||
          c.categories.some((cat) => cat.toLowerCase().includes(kw)),
      );
    }
    if (filter.categories && filter.categories.length > 0) {
      filtered = filtered.filter((c) =>
        filter.categories!.some((cat) => c.categories.includes(cat)),
      );
    }
    if (filter.platforms && filter.platforms.length > 0) {
      filtered = filtered.filter((c) =>
        c.platforms.some((p) => filter.platforms!.includes(p.platform)),
      );
    }
    if (filter.minFollowers) {
      filtered = filtered.filter((c) =>
        c.platforms.some((p) => p.followers >= filter.minFollowers!),
      );
    }
    if (filter.maxFollowers) {
      filtered = filtered.filter((c) =>
        c.platforms.every((p) => p.followers <= filter.maxFollowers!),
      );
    }
    if (filter.minEngagementRate) {
      filtered = filtered.filter((c) => c.avgEngagementRate >= filter.minEngagementRate!);
    }
    if (typeof filter.verified === 'boolean') {
      filtered = filtered.filter((c) => c.verified === filter.verified);
    }
  }

  const page = pagination.page ?? 1;
  const pageSize = pagination.pageSize ?? 10;
  const start = (page - 1) * pageSize;
  const pagedList = filtered.slice(start, start + pageSize);

  return delay({
    list: pagedList,
    total: filtered.length,
    page,
    pageSize,
  });
}

export function getCreatorById(id: string): Promise<Creator | null> {
  const creator = creators.find((c) => c.id === id) ?? null;
  return delay(creator);
}

export function getCreatorByUserId(userId: string): Promise<Creator | null> {
  const creator = creators.find((c) => c.userId === userId) ?? null;
  return delay(creator);
}

export interface ListingsFilter {
  creatorId?: string;
  type?: ListingType;
  minPrice?: number;
  maxPrice?: number;
  maxDeliveryDays?: number;
}

export function getListings(filter: ListingsFilter = {}): Promise<SponsorshipPackage[]> {
  let filtered = [...sponsorshipPackages];

  if (filter.creatorId) {
    filtered = filtered.filter((p) => p.creatorId === filter.creatorId);
  }
  if (filter.type) {
    filtered = filtered.filter((p) => p.type === filter.type);
  }
  if (filter.minPrice) {
    filtered = filtered.filter((p) => p.price >= filter.minPrice!);
  }
  if (filter.maxPrice) {
    filtered = filtered.filter((p) => p.price <= filter.maxPrice!);
  }
  if (filter.maxDeliveryDays) {
    filtered = filtered.filter((p) => p.deliveryDays <= filter.maxDeliveryDays!);
  }

  return delay(filtered);
}

export function getListingById(id: string): Promise<SponsorshipPackage | null> {
  const pkg = sponsorshipPackages.find((p) => p.id === id) ?? null;
  return delay(pkg);
}

export interface CreateListingInput {
  creatorId: string;
  type: ListingType;
  name: string;
  description: string;
  price: number;
  deliveryDays: number;
  includes: string[];
}

export function createListing(input: CreateListingInput): Promise<SponsorshipPackage> {
  const newPackage: SponsorshipPackage = {
    id: `p${Date.now()}`,
    creatorId: input.creatorId,
    type: input.type,
    name: input.name,
    description: input.description,
    price: input.price,
    deliveryDays: input.deliveryDays,
    includes: input.includes,
    createdAt: new Date().toISOString(),
  };
  sponsorshipPackages.push(newPackage);
  return delay(newPackage, 500);
}

export function updateListing(
  id: string,
  patch: Partial<Omit<SponsorshipPackage, 'id' | 'creatorId' | 'createdAt'>>,
): Promise<SponsorshipPackage | null> {
  const index = sponsorshipPackages.findIndex((p) => p.id === id);
  if (index === -1) return delay(null);
  sponsorshipPackages[index] = { ...sponsorshipPackages[index], ...patch };
  return delay(sponsorshipPackages[index]);
}

export function deleteListing(id: string): Promise<boolean> {
  const index = sponsorshipPackages.findIndex((p) => p.id === id);
  if (index === -1) return delay(false);
  sponsorshipPackages.splice(index, 1);
  return delay(true);
}

export function getCreatorCases(creatorId: string): Promise<CollaborationCase[]> {
  const cases = collaborationCases.filter((c) => c.creatorId === creatorId);
  return delay(cases);
}
