export type OwnerLike = { userId: string }
export type SessionUser = { id: string } | null

export function isOwner(user: SessionUser, resource: OwnerLike): boolean {
  return !!user && user.id === resource.userId
}

export function assertOwner(user: SessionUser, resource: OwnerLike): void {
  if (!isOwner(user, resource)) {
    const e = new Error("FORBIDDEN") as Error & { status: number }
    e.status = 403
    throw e
  }
}