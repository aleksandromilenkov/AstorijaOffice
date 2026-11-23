/**
 * Wraps every page; Next.js re-mounts it on each navigation, so the
 * `page-enter` animation (globals.css) gives every page a soft glide-in.
 */
export default function Template({ children }) {
  return <div className="page-enter">{children}</div>
}
