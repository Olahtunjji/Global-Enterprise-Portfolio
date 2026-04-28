import { useListSkills } from "@workspace/api-client-react";
import { Anchor, Ship, Cog, ShieldCheck, Radio, Compass, GraduationCap, LandPlot, LifeBuoy } from "lucide-react";
import { useMemo } from "react";

const ICON_MAP: Record<string, React.ElementType> = {
  Anchor, Ship, Cog, ShieldCheck, Radio, Compass, GraduationCap, LandPlot, LifeBuoy
};

export default function SkillsBanner() {
  const { data: skills = [] } = useListSkills();

  // Duplicate items to ensure smooth infinite scroll
  const duplicatedSkills = useMemo(() => {
    if (skills.length === 0) return [];
    return [...skills, ...skills, ...skills];
  }, [skills]);

  if (skills.length === 0) return null;

  return (
    <div className="bg-primary text-primary-foreground border-b border-primary-border overflow-hidden relative h-12 flex items-center">
      <div className="absolute inset-0 z-10 pointer-events-none skills-mask"></div>
      
      <div className="skills-marquee hover:[animation-play-state:paused]">
        {duplicatedSkills.map((skill, index) => {
          const Icon = ICON_MAP[skill.iconKey] || Anchor;
          return (
            <div 
              key={`${skill.id}-${index}`} 
              className="flex items-center gap-2 px-6 shrink-0"
            >
              {skill.logoUrl ? (
                <div className="w-6 h-6 rounded-sm bg-white p-0.5 flex items-center justify-center">
                  <img src={skill.logoUrl} alt={skill.name} className="max-w-full max-h-full object-contain" />
                </div>
              ) : (
                <div 
                  className="w-6 h-6 rounded-sm flex items-center justify-center text-white"
                  style={{ backgroundColor: skill.accentColor || 'hsl(var(--accent))' }}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
              )}
              <span className="font-medium text-sm whitespace-nowrap">{skill.name}</span>
              <span className="text-xs text-primary-foreground/60 ml-1 uppercase tracking-wider">{skill.category}</span>
              <span className="mx-6 text-primary-foreground/30">•</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
