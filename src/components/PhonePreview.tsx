import { LinkItem, ThemeConfig } from "../types";
import { 
  Instagram, 
  Linkedin, 
  Twitter, 
  Github, 
  Mail, 
  ExternalLink 
} from "lucide-react";

interface PhonePreviewProps {
  theme: ThemeConfig;
  profileName: string;
  profileBio: string;
  profileImage: string;
  links: LinkItem[];
  customStyles: {
    buttonStyle: string; // "flat" | "semi" | "soft"
    alignment: "left" | "center" | "right";
    shadowSize: "none" | "small" | "large";
  };
  onLinkMockClick: (linkId: string) => void;
  socialHandles: {
    instagram?: string;
    tiktok?: string;
    twitter?: string;
    linkedin?: string;
    peerlist?: string;
    github?: string;
    gmail?: string;
  };
}

export default function PhonePreview({
  theme,
  profileName,
  profileBio,
  profileImage,
  links,
  customStyles,
  onLinkMockClick,
  socialHandles,
}: PhonePreviewProps) {
  const getRadiusClass = () => {
    switch (theme.borderRadius) {
      case "rounded-none": return "rounded-none";
      case "rounded-md": return "rounded-md";
      case "rounded-xl": return "rounded-xl";
      case "rounded-2xl": return "rounded-2xl";
      case "rounded-3xl": return "rounded-3xl";
      default: return "rounded-full";
    }
  };

  const getShadowClass = () => {
    switch (customStyles.shadowSize) {
      case "none": return "shadow-none";
      case "small": return "shadow-xs";
      case "large": return "shadow-xl shadow-indigo-950/20";
      default: return "shadow-md";
    }
  };

  const publishedLinks = links.filter((l) => l.isPublished);

  // Social icons platform mappings
  const renderSocialIcon = (platform: string, handle: string) => {
    if (!handle) return null;
    const url = platform === "gmail" ? `mailto:${handle}` : `https://${platform}.com/${handle}`;
    
    // Custom Peerlist render, other standard lucide icons
    const iconProps = { className: "w-5 h-5 transition-transform hover:scale-110", strokeWidth: 1.8 };
    
    return (
      <a 
        key={platform} 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        title={`${platform}: ${handle}`}
        className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
      >
        {platform === "instagram" && <Instagram {...iconProps} />}
        {platform === "linkedin" && <Linkedin {...iconProps} />}
        {platform === "twitter" && <Twitter {...iconProps} />}
        {platform === "github" && <Github {...iconProps} />}
        {platform === "gmail" && <Mail {...iconProps} />}
        {platform === "tiktok" && (
          <img 
            src="https://www.image2url.com/r2/default/images/1779766589355-f3dd73b8-7e2f-481f-82fa-19d938c100fd.png" 
            alt="TikTok Logo" 
            className="w-5 h-5 object-contain brightness-100 dark:brightness-100 transition-transform hover:scale-110"
            referrerPolicy="no-referrer"
          />
        )}
        {platform === "peerlist" && (
          <img 
            src="https://www.image2url.com/r2/default/images/1779766616427-550a4dc8-4353-41bb-80fb-96817ccdd7ec.png" 
            alt="Peerlist Logo" 
            className="w-5 h-5 object-contain rounded-xs transition-transform hover:scale-110"
            referrerPolicy="no-referrer"
          />
        )}
      </a>
    );
  };

  return (
    <div id="phone-preview-container" className="flex justify-center items-center py-6">
      {/* High-Fidelity Phone Container */}
      <div className="relative w-[310px] h-[640px] rounded-[48px] border-[10px] border-slate-900 bg-slate-950 shadow-2xl overflow-hidden flex flex-col">
        {/* Phone Speaker Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900 rounded-full z-30 flex items-center justify-center">
          <div className="w-12 h-1 bg-slate-800 rounded-full" />
        </div>

        {/* Custom Inner Phone Background Screen */}
        <div className={`flex-1 overflow-y-auto no-scrollbar pt-12 pb-6 px-4 transition-all duration-300 ${theme.backgroundClass} ${theme.fontFamily} ${theme.textClass} flex flex-col justify-between`}>
          
          <div className="flex flex-col items-center pt-4">
            {/* Active creator status bar badge */}
            <div className="mb-4 inline-flex items-center gap-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded-full text-[9px] font-bold tracking-wider uppercase font-mono">
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping" />
              Verified Space 🔗
            </div>

            {/* Profile Info */}
            <h2 className={`text-base font-bold tracking-tight text-center truncate w-full px-2`}>
              {profileName || "@yourhandle"}
            </h2>
            <p className="text-xs opacity-75 text-center mt-1 max-w-[200px] line-clamp-3 leading-relaxed">
              {profileBio || "Craft your custom link-in-bio profile. Track performance and organic reach."}
            </p>

            {/* Horizontal Platform Quick Tiles */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 mt-4 max-w-[240px]">
              {Object.entries(socialHandles).map(([plat, handle]) => {
                if (handle) {
                  return renderSocialIcon(plat, handle);
                }
                return null;
              })}
            </div>

            {/* Dynamic Link Cards */}
            <div className="w-full mt-6 space-y-3 px-1">
              {publishedLinks.length === 0 ? (
                <div className="text-center p-6 border border-dashed border-white/10 rounded-xl text-xs opacity-50">
                  No active links added yet. Use the editor to add links.
                </div>
              ) : (
                publishedLinks.map((link) => {
                  return (
                    <button
                      key={link.id}
                      onClick={() => onLinkMockClick(link.id)}
                      className={`w-full py-3.5 px-4 transition-all duration-200 transform active:scale-98 flex items-center justify-between text-xs font-medium cursor-pointer ${theme.cardBgClass} ${getRadiusClass()} ${getShadowClass()} ${
                        customStyles.alignment === "center" ? "justify-center text-center" : 
                        customStyles.alignment === "right" ? "flex-row-reverse text-right" : "text-left"
                      } group relative overflow-hidden`}
                    >
                      {/* Left Icon spacing if center */}
                      <div className="flex items-center gap-2 max-w-[85%] truncate">
                        <span className="capitalize text-[10px] font-semibold opacity-60 bg-white/10 px-1.5 py-0.5 rounded-sm">
                          {link.platform === "custom" ? "Link" : link.platform}
                        </span>
                        <span className="truncate block font-semibold">{link.title || "Untitled Link"}</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Footer Logo */}
          <div className="mt-8 flex flex-col items-center justify-center opacity-40 text-[9px]">
            <span className="font-semibold tracking-wider font-mono">Linkify.me</span>
            <span className="mt-0.5 whitespace-nowrap">Integrated Analytics Bio</span>
          </div>

        </div>
      </div>
    </div>
  );
}
