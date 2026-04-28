import { useEffect, useMemo } from "react";
import {
  useGetBusinessProfile,
  useListLandmarks,
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, MapPin, Phone, Star, Anchor } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  CircleMarker,
} from "react-leaflet";

L.Icon.Default.mergeOptions({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
});

const OFFICE_LAT = 6.5483;
const OFFICE_LNG = 3.2967;

function StarRow({ count }: { count: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${
            i < count ? "fill-accent text-accent" : "text-muted-foreground"
          }`}
        />
      ))}
    </span>
  );
}

export default function Contact() {
  const { data: profile } = useGetBusinessProfile();
  const { data: landmarks = [] } = useListLandmarks();

  const refId = useMemo(() => {
    if (typeof window === "undefined") return null;
    const params = new URLSearchParams(window.location.search);
    return params.get("ref");
  }, []);
  const paid = useMemo(() => {
    if (typeof window === "undefined") return null;
    const params = new URLSearchParams(window.location.search);
    return params.get("paid");
  }, []);

  useEffect(() => {
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 200);
  }, []);

  const center: [number, number] =
    profile && Number.isFinite(profile.latitude) && Number.isFinite(profile.longitude)
      ? [profile.latitude, profile.longitude]
      : [OFFICE_LAT, OFFICE_LNG];

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-8">
        <Badge variant="secondary" className="mb-2 uppercase tracking-wider">
          Contact
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">
          Visit the workshop
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Reach the EMMYFAD office on Idimu Road in Ejigbo, Lagos. The map below
          shows nearby restaurants — well-known navigation landmarks — to help
          you find the workshop.
        </p>
      </div>

      {refId && (
        <Card className="mb-6 border-secondary bg-secondary/10">
          <CardContent className="py-5">
            <p className="text-foreground">
              <strong>Thank you.</strong> We received your contract request
              <span className="font-mono"> #{refId}</span>. A representative
              will respond within two business days.
            </p>
          </CardContent>
        </Card>
      )}
      {paid === "1" && (
        <Card className="mb-6 border-secondary bg-secondary/10">
          <CardContent className="py-5">
            <p className="text-foreground">
              <strong>Payment received.</strong> Thank you — your milestone
              payment was successful. A receipt has been issued to your email.
            </p>
          </CardContent>
        </Card>
      )}
      {paid === "0" && (
        <Card className="mb-6 border-destructive bg-destructive/10">
          <CardContent className="py-5">
            <p className="text-foreground">
              The payment was cancelled. You can ask the EMMYFAD team to resend
              the secure payment link at any time.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-xl">Office details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-accent mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-foreground">Address</p>
                <p className="text-foreground/80">
                  {profile?.address ?? "62B Idimu Road, Ejigbo, Lagos State"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-accent mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-foreground">Email</p>
                <a
                  href={`mailto:${profile?.email ?? "efadirepo@yahoo.com"}`}
                  className="text-secondary hover:underline"
                >
                  {profile?.email ?? "efadirepo@yahoo.com"}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-accent mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-foreground">Phone</p>
                <p className="text-foreground/80">+234 802 555 0118</p>
                <p className="text-xs text-muted-foreground">
                  WhatsApp available — same number.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Anchor className="w-5 h-5 text-accent mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-foreground">Office hours</p>
                <p className="text-foreground/80">
                  Mon&ndash;Sat&nbsp;&middot;&nbsp;08:00&ndash;18:00 WAT
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xl">Find us on the map</CardTitle>
            <p className="text-sm text-muted-foreground">
              Marker pinned at the workshop. Surrounding markers are
              two-star and above restaurants used as navigation landmarks.
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[480px] w-full">
              <MapContainer
                center={center}
                zoom={15}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution='&copy; OpenStreetMap contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={center}>
                  <Popup>
                    <div className="space-y-1">
                      <strong className="text-primary">EMMYFAD Workshop</strong>
                      <div className="text-sm">
                        {profile?.address ?? "62B Idimu Road, Ejigbo, Lagos"}
                      </div>
                    </div>
                  </Popup>
                </Marker>
                {landmarks.map((l) => (
                  <CircleMarker
                    key={l.id}
                    center={[l.latitude, l.longitude]}
                    radius={8}
                    pathOptions={{
                      color: "#C97B17",
                      fillColor: "#F2A93B",
                      fillOpacity: 0.9,
                      weight: 2,
                    }}
                  >
                    <Popup>
                      <div className="space-y-2 max-w-[240px]">
                        <div className="flex items-center justify-between gap-2">
                          <strong className="text-primary">{l.name}</strong>
                          <StarRow count={l.starRating} />
                        </div>
                        <div className="text-xs uppercase tracking-wider text-muted-foreground">
                          {l.category}
                        </div>
                        <p className="text-sm">{l.directionsHint}</p>
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}
              </MapContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-xl">Landmarks near the office</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {landmarks.map((l) => (
              <div
                key={l.id}
                className="flex flex-col gap-1 p-4 rounded-md border bg-muted/30"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-foreground">{l.name}</p>
                  <StarRow count={l.starRating} />
                </div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  {l.category}
                </p>
                <p className="text-sm text-foreground/85">{l.directionsHint}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
