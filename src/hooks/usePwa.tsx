import { useEffect, useState } from "react"

export const usePwa = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>()

  const handleInstallClick = async () => {
    if (deferredPrompt !== null) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === "accepted") {
        setDeferredPrompt(null)
      }
    }
  }

  useEffect(() => {
    const handleBeforeInstallFn = (e: any) => {
      setDeferredPrompt(e)
    }

    const handleAppInstalled = (e: any) => {
      setDeferredPrompt(null)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallFn)

    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallFn)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  return { handleInstallClick, deferredPrompt }
}
