import { useRef, useState, useMemo, Suspense } from "react";
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Text, Environment, PerspectiveCamera, useCursor } from "@react-three/drei";
import * as THREE from "three";
import { Room } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IndianRupee, Bed as BedIcon, Users, X, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── Color palette ───────────────────────────────────────────────────────────
const STATUS_COLORS: Record<string, string> = {
  Available: "#22c55e",
  Occupied: "#3b82f6",
  Maintenance: "#f97316",
};

const STATUS_EMISSIVE: Record<string, string> = {
  Available: "#16a34a",
  Occupied: "#1d4ed8",
  Maintenance: "#c2410c",
};

const TYPE_LABEL: Record<string, string> = {
  Single: "S",
  Double: "D",
  Triple: "T",
};

const BED_COUNT: Record<string, number> = {
  Single: 1,
  Double: 2,
  Triple: 3,
};

// Room shell dimensions
const ROOM_W = 1.7;
const ROOM_H = 1.2;
const ROOM_D = 1.7;
const WALL_T = 0.05;
const GRID_GAP = 2.0; // center-to-center spacing of rooms
const FLOOR_HEIGHT = 2.2;

// ─── Bed ─────────────────────────────────────────────────────────────────────
const Bed: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    {/* Frame */}
    <mesh position={[0, 0.07, 0]}>
      <boxGeometry args={[0.5, 0.14, 0.95]} />
      <meshStandardMaterial color="#7c4a21" roughness={0.8} />
    </mesh>
    {/* Mattress */}
    <mesh position={[0, 0.175, 0]}>
      <boxGeometry args={[0.46, 0.07, 0.9]} />
      <meshStandardMaterial color="#f1f5f9" roughness={0.9} />
    </mesh>
    {/* Pillow (head against back wall) */}
    <mesh position={[0, 0.23, -0.32]}>
      <boxGeometry args={[0.3, 0.05, 0.18]} />
      <meshStandardMaterial color="#e2e8f0" roughness={0.95} />
    </mesh>
    {/* Blanket */}
    <mesh position={[0, 0.218, 0.18]}>
      <boxGeometry args={[0.47, 0.035, 0.5]} />
      <meshStandardMaterial color="#0d9488" roughness={0.85} />
    </mesh>
  </group>
);

// X positions of beds inside a room, by type
const BED_X: Record<number, number[]> = {
  1: [-0.3],
  2: [-0.42, 0.42],
  3: [-0.55, 0, 0.55],
};

// ─── Window pane (lit when occupied) ─────────────────────────────────────────
const WindowPane: React.FC<{
  position: [number, number, number];
  rotationY?: number;
  lit: boolean;
}> = ({ position, rotationY = 0, lit }) => (
  <group position={position} rotation={[0, rotationY, 0]}>
    {/* Frame */}
    <mesh>
      <boxGeometry args={[0.6, 0.46, 0.04]} />
      <meshStandardMaterial color="#1e293b" roughness={0.6} />
    </mesh>
    {/* Glass — warm glow when the room is occupied (lights on) */}
    <mesh position={[0, 0, 0.012]}>
      <boxGeometry args={[0.52, 0.38, 0.03]} />
      <meshStandardMaterial
        color={lit ? "#ffd166" : "#334155"}
        emissive={lit ? "#ffb340" : "#0c4a6e"}
        emissiveIntensity={lit ? 0.9 : 0.15}
        roughness={0.3}
        metalness={0.1}
      />
    </mesh>
    {/* Mullions */}
    <mesh position={[0, 0, 0.026]}>
      <boxGeometry args={[0.03, 0.38, 0.012]} />
      <meshStandardMaterial color="#1e293b" />
    </mesh>
    <mesh position={[0, 0, 0.026]}>
      <boxGeometry args={[0.52, 0.03, 0.012]} />
      <meshStandardMaterial color="#1e293b" />
    </mesh>
  </group>
);

// ─── Single Room (shell + interior) ──────────────────────────────────────────
interface RoomBoxProps {
  room: Room;
  position: [number, number, number];
  isSelected: boolean;
  isHovered: boolean;
  onClick: (room: Room) => void;
  onPointerOver: (id: number) => void;
  onPointerOut: () => void;
}

const RoomBox: React.FC<RoomBoxProps> = ({
  room,
  position,
  isSelected,
  isHovered,
  onClick,
  onPointerOver,
  onPointerOut,
}) => {
  const groupRef = useRef<THREE.Group>(null!);
  const color = STATUS_COLORS[room.status] ?? "#6b7280";
  const emissive = STATUS_EMISSIVE[room.status] ?? "#374151";
  const lit = room.status === "Occupied";
  const beds = BED_X[BED_COUNT[room.type] ?? 1];

  useCursor(isHovered);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const target = isSelected ? 1.14 : isHovered ? 1.07 : 1;
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, target, delta * 6)
    );
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onClick(room);
  };

  const highlight = isSelected || isHovered;
  const interiorFloorY = -ROOM_H / 2 + 0.03;

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={handleClick}
      onPointerOver={(e) => { e.stopPropagation(); onPointerOver(room.id); }}
      onPointerOut={() => onPointerOut()}
    >
      {/* Room floor */}
      <mesh position={[0, -ROOM_H / 2, 0]}>
        <boxGeometry args={[ROOM_W, 0.06, ROOM_D]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.9} />
      </mesh>

      {/* Roof — status-tinted so state reads from a top-down view too */}
      <mesh position={[0, ROOM_H / 2, 0]}>
        <boxGeometry args={[ROOM_W, 0.06, ROOM_D]} />
        <meshStandardMaterial
          color={emissive}
          emissive={highlight ? emissive : "#000000"}
          emissiveIntensity={isSelected ? 0.5 : isHovered ? 0.3 : 0}
          roughness={0.7}
        />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 0, -(ROOM_D / 2 - WALL_T / 2)]}>
        <boxGeometry args={[ROOM_W, ROOM_H, WALL_T]} />
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.05} />
      </mesh>

      {/* Side walls (status-colored, matches legend) */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * (ROOM_W / 2 - WALL_T / 2), 0, 0]}>
          <boxGeometry args={[WALL_T, ROOM_H, ROOM_D]} />
          <meshStandardMaterial
            color={color}
            emissive={highlight ? emissive : "#000000"}
            emissiveIntensity={isSelected ? 0.4 : isHovered ? 0.22 : 0}
            roughness={0.7}
            metalness={0.05}
          />
        </mesh>
      ))}

      {/* Glass front — see the beds inside */}
      <mesh position={[0, 0, ROOM_D / 2 - 0.01]}>
        <boxGeometry args={[ROOM_W - 0.1, ROOM_H - 0.12, 0.02]} />
        <meshStandardMaterial
          color="#7dd3fc"
          transparent
          opacity={0.16}
          roughness={0.1}
          metalness={0.3}
        />
      </mesh>

      {/* Door on the front, right side */}
      <group position={[0.5, -0.14, ROOM_D / 2 + 0.015]}>
        <mesh>
          <boxGeometry args={[0.42, 0.88, 0.04]} />
          <meshStandardMaterial color="#854d0e" roughness={0.75} />
        </mesh>
        {/* Knob */}
        <mesh position={[-0.14, -0.05, 0.03]}>
          <sphereGeometry args={[0.03, 12, 12]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>

      {/* Windows: one on each side wall + back wall */}
      <WindowPane position={[-(ROOM_W / 2 + 0.01), 0.12, 0]} rotationY={Math.PI / 2} lit={lit} />
      <WindowPane position={[ROOM_W / 2 + 0.01, 0.12, 0]} rotationY={Math.PI / 2} lit={lit} />
      <WindowPane position={[0, 0.12, -(ROOM_D / 2 + 0.01)]} lit={lit} />

      {/* Beds — count matches room type */}
      {beds.map((x, i) => (
        <Bed key={i} position={[x, interiorFloorY, -0.32]} />
      ))}

      {/* Room number on the roof */}
      <Text
        position={[0, ROOM_H / 2 + 0.05, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {room.number}
      </Text>

      {/* Type badge above the door */}
      <Text
        position={[-0.45, 0.34, ROOM_D / 2 + 0.03]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        fillOpacity={0.85}
      >
        {TYPE_LABEL[room.type]}
      </Text>

      {/* Selection ring */}
      {isSelected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -ROOM_H / 2 - 0.02, 0]}>
          <ringGeometry args={[0.95, 1.08, 32]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
};

// ─── Washroom block (one per floor) ──────────────────────────────────────────
const WashroomBlock: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    {/* Tiled cabin */}
    <mesh position={[0, -0.07, 0]}>
      <boxGeometry args={[1.5, 1.05, 1.45]} />
      <meshStandardMaterial color="#cbd5e1" roughness={0.5} metalness={0.05} />
    </mesh>
    {/* Door */}
    <mesh position={[0.3, -0.2, 0.74]}>
      <boxGeometry args={[0.36, 0.78, 0.04]} />
      <meshStandardMaterial color="#64748b" roughness={0.6} />
    </mesh>
    {/* Vent window */}
    <mesh position={[0.76, 0.22, 0]}>
      <boxGeometry args={[0.04, 0.18, 0.32]} />
      <meshStandardMaterial color="#334155" emissive="#0ea5e9" emissiveIntensity={0.2} />
    </mesh>
    {/* WC label */}
    <Text
      position={[-0.3, 0.18, 0.77]}
      fontSize={0.24}
      color="#0f172a"
      anchorX="center"
      anchorY="middle"
    >
      WC
    </Text>
  </group>
);

// ─── Lift shaft (spans all floors) ───────────────────────────────────────────
const LiftShaft: React.FC<{ x: number; floors: number[] }> = ({ x, floors }) => {
  const bottom = -0.71;
  const top = (floors.length - 1) * FLOOR_HEIGHT + 1.0;
  const height = top - bottom;
  const centerY = (top + bottom) / 2;

  return (
    <group position={[x, 0, 0]}>
      {/* Shaft column */}
      <mesh position={[0, centerY, 0]}>
        <boxGeometry args={[1.4, height, 1.5]} />
        <meshStandardMaterial color="#475569" metalness={0.5} roughness={0.45} />
      </mesh>

      {/* Machine room on the roof */}
      <mesh position={[0, top + 0.22, 0]}>
        <boxGeometry args={[1.0, 0.45, 1.1]} />
        <meshStandardMaterial color="#334155" metalness={0.4} roughness={0.6} />
      </mesh>

      {/* LIFT sign */}
      <Text
        position={[0, top + 0.24, 0.58]}
        fontSize={0.22}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        LIFT
      </Text>

      {/* Doors + indicator + floor label, per floor */}
      {floors.map((floorNum, idx) => {
        const y = idx * FLOOR_HEIGHT;
        return (
          <group key={floorNum} position={[0, y, 0.76]}>
            {/* Sliding door panels */}
            {[-1, 1].map((side) => (
              <mesh key={side} position={[side * 0.165, -0.08, 0]}>
                <boxGeometry args={[0.3, 0.95, 0.04]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} />
              </mesh>
            ))}
            {/* Indicator light above doors */}
            <mesh position={[0, 0.52, 0]}>
              <boxGeometry args={[0.5, 0.07, 0.04]} />
              <meshStandardMaterial color="#0f172a" emissive="#22d3ee" emissiveIntensity={0.9} />
            </mesh>
            {/* Floor label */}
            <Text
              position={[0, 0.68, 0.01]}
              fontSize={0.16}
              color="#94a3b8"
              anchorX="center"
              anchorY="middle"
            >
              {`F${floorNum}`}
            </Text>
          </group>
        );
      })}
    </group>
  );
};

// ─── Floor Plate ─────────────────────────────────────────────────────────────
interface FloorPlateProps {
  roomsOnFloor: Room[];
  yOffset: number;
  plateCols: number;
  plateRows: number;
  selectedRoom: Room | null;
  hoveredId: number | null;
  onRoomClick: (room: Room) => void;
  onPointerOver: (id: number) => void;
  onPointerOut: () => void;
}

const FloorPlate: React.FC<FloorPlateProps> = ({
  roomsOnFloor,
  yOffset,
  plateCols,
  plateRows,
  selectedRoom,
  hoveredId,
  onRoomClick,
  onPointerOver,
  onPointerOut,
}) => {
  const cols = Math.min(roomsOnFloor.length, plateCols);
  const roomsW = plateCols * GRID_GAP;
  const roomsD = plateRows * GRID_GAP;

  // Slab extends right to hold the washroom block
  const washX = roomsW / 2 + 1.1;
  const left = -(roomsW / 2) - 0.5;
  const right = washX + 0.95;
  const plateW = right - left;
  const plateCX = (left + right) / 2;
  const plateD = roomsD + 0.8;

  return (
    <group position={[0, yOffset, 0]}>
      {/* Floor slab */}
      <mesh position={[plateCX, -0.65, 0]} receiveShadow>
        <boxGeometry args={[plateW, 0.12, plateD]} />
        <meshStandardMaterial color="#1e293b" metalness={0.4} roughness={0.7} />
      </mesh>

      {/* Floor edge glow strip */}
      <mesh position={[plateCX, -0.58, 0]}>
        <boxGeometry args={[plateW, 0.04, plateD]} />
        <meshStandardMaterial color="#334155" emissive="#0ea5e9" emissiveIntensity={0.3} />
      </mesh>

      {/* Common washroom for this floor */}
      <WashroomBlock position={[washX, 0, 0]} />

      {/* Rooms */}
      {roomsOnFloor.map((room, idx) => {
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        const x = col * GRID_GAP - ((cols - 1) * GRID_GAP) / 2;
        const z = row * GRID_GAP - ((Math.ceil(roomsOnFloor.length / cols) - 1) * GRID_GAP) / 2;
        return (
          <RoomBox
            key={room.id}
            room={room}
            position={[x, 0, z]}
            isSelected={selectedRoom?.id === room.id}
            isHovered={hoveredId === room.id}
            onClick={onRoomClick}
            onPointerOver={onPointerOver}
            onPointerOut={onPointerOut}
          />
        );
      })}
    </group>
  );
};

// ─── Full Building Scene ──────────────────────────────────────────────────────
interface BuildingSceneProps {
  rooms: Room[];
  selectedRoom: Room | null;
  onRoomClick: (room: Room) => void;
}

const BuildingScene: React.FC<BuildingSceneProps> = ({ rooms, selectedRoom, onRoomClick }) => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const byFloor = useMemo(() => {
    const map = new Map<number, Room[]>();
    rooms.forEach((r) => {
      if (!map.has(r.floor)) map.set(r.floor, []);
      map.get(r.floor)!.push(r);
    });
    return [...map.entries()].sort((a, b) => a[0] - b[0]);
  }, [rooms]);

  // Uniform footprint across floors so the building reads as one block
  const { plateCols, plateRows } = useMemo(() => {
    let maxCount = 1;
    byFloor.forEach(([, floorRooms]) => {
      maxCount = Math.max(maxCount, floorRooms.length);
    });
    const cols = Math.min(maxCount, 4);
    return { plateCols: cols, plateRows: Math.ceil(maxCount / cols) };
  }, [byFloor]);

  const roomsW = plateCols * GRID_GAP;
  const liftX = -(roomsW / 2 + 1.35);

  return (
    <>
      <PerspectiveCamera makeDefault position={[12, 14, 18]} fov={45} />
      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        minDistance={6}
        maxDistance={45}
        minPolarAngle={0.2}
        maxPolarAngle={Math.PI / 2.1}
        target={[0, (byFloor.length * FLOOR_HEIGHT) / 2, 0]}
      />

      {/* Lighting */}
      <ambientLight intensity={0.55} />
      <directionalLight
        castShadow
        position={[10, 18, 10]}
        intensity={1.4}
        shadow-mapSize={[2048, 2048]}
      />
      <pointLight position={[-8, 10, -8]} intensity={0.5} color="#6366f1" />
      <pointLight position={[8, 4, 8]} intensity={0.3} color="#0ea5e9" />

      <Environment preset="city" />

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.72, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#0f172a" metalness={0.3} roughness={0.9} />
      </mesh>

      {/* Lift shaft serving every floor */}
      <LiftShaft x={liftX} floors={byFloor.map(([floorNum]) => floorNum)} />

      {/* Floors */}
      {byFloor.map(([floorNum, floorRooms], idx) => (
        <FloorPlate
          key={floorNum}
          roomsOnFloor={floorRooms}
          yOffset={idx * FLOOR_HEIGHT}
          plateCols={plateCols}
          plateRows={plateRows}
          selectedRoom={selectedRoom}
          hoveredId={hoveredId}
          onRoomClick={onRoomClick}
          onPointerOver={setHoveredId}
          onPointerOut={() => setHoveredId(null)}
        />
      ))}
    </>
  );
};

// ─── Room Detail Panel ────────────────────────────────────────────────────────
const RoomDetailPanel: React.FC<{ room: Room; onClose: () => void }> = ({ room, onClose }) => {
  const statusClass: Record<string, string> = {
    Available: "bg-green-500/10 text-green-400 border-green-500/20",
    Occupied: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Maintenance: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  };

  return (
    <div className="absolute top-4 right-4 z-10 w-64 animate-in slide-in-from-right-4 fade-in duration-200">
      <Card className="bg-slate-900/90 backdrop-blur border-slate-700 shadow-2xl">
        <CardHeader className="pb-2 flex flex-row items-start justify-between">
          <div>
            <CardTitle className="text-white text-lg">Room {room.number}</CardTitle>
            <p className="text-slate-400 text-xs">Floor {room.floor}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-slate-400 hover:text-white -mt-1 -mr-1"
            onClick={onClose}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <Badge variant="outline" className={`text-xs ${statusClass[room.status]}`}>
            {room.status}
          </Badge>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <BedIcon className="h-3.5 w-3.5 text-slate-500" />
              <span>{room.type} Occupancy</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <IndianRupee className="h-3.5 w-3.5 text-slate-500" />
              <span>₹{room.rent.toLocaleString()} / month</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Users className="h-3.5 w-3.5 text-slate-500" />
              <span>Deposit: ₹{room.deposit.toLocaleString()}</span>
            </div>
          </div>

          <div className="pt-1 border-t border-slate-700">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Room ID</span>
              <span className="text-slate-400">#{room.id}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ─── Legend ───────────────────────────────────────────────────────────────────
const Legend: React.FC = () => (
  <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-1.5 bg-slate-900/80 backdrop-blur px-3 py-2 rounded-lg border border-slate-700">
    <p className="text-xs font-semibold text-slate-400 mb-0.5">Legend</p>
    {Object.entries(STATUS_COLORS).map(([status, color]) => (
      <div key={status} className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: color }} />
        <span className="text-xs text-slate-300">{status}</span>
      </div>
    ))}
    <div className="mt-1 pt-1 border-t border-slate-700 space-y-0.5">
      {[["S", "Single"], ["D", "Double"], ["T", "Triple"]].map(([k, v]) => (
        <div key={k} className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-slate-600 flex-shrink-0 text-[9px] text-white flex items-center justify-center font-bold">{k}</span>
          <span className="text-xs text-slate-300">{v}</span>
        </div>
      ))}
    </div>
    <div className="mt-1 pt-1 border-t border-slate-700 space-y-0.5">
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: "#475569" }} />
        <span className="text-xs text-slate-300">Lift</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: "#cbd5e1" }} />
        <span className="text-xs text-slate-300">Washroom (WC)</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: "#ffd166" }} />
        <span className="text-xs text-slate-300">Lights on = occupied</span>
      </div>
    </div>
    <p className="text-[10px] text-slate-500 mt-1">Click a room to inspect</p>
  </div>
);

// ─── Stats Bar ───────────────────────────────────────────────────────────────
const StatsBar: React.FC<{ rooms: Room[] }> = ({ rooms }) => {
  const available = rooms.filter(r => r.status === "Available").length;
  const occupied = rooms.filter(r => r.status === "Occupied").length;
  const maintenance = rooms.filter(r => r.status === "Maintenance").length;
  const occupancyPct = rooms.length ? Math.round((occupied / rooms.length) * 100) : 0;

  return (
    <div className="absolute top-4 left-4 z-10 flex gap-2">
      {[
        { label: "Available", count: available, color: "text-green-400" },
        { label: "Occupied", count: occupied, color: "text-blue-400" },
        { label: "Maint.", count: maintenance, color: "text-orange-400" },
      ].map(({ label, count, color }) => (
        <div key={label} className="bg-slate-900/80 backdrop-blur border border-slate-700 rounded-lg px-3 py-1.5 text-center">
          <div className={`text-lg font-bold leading-none ${color}`}>{count}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">{label}</div>
        </div>
      ))}
      <div className="bg-slate-900/80 backdrop-blur border border-slate-700 rounded-lg px-3 py-1.5 text-center">
        <div className="text-lg font-bold leading-none text-purple-400">{occupancyPct}%</div>
        <div className="text-[10px] text-slate-500 mt-0.5">Occupancy</div>
      </div>
    </div>
  );
};

// ─── Main Export ──────────────────────────────────────────────────────────────
interface RoomFloorMap3DProps {
  rooms: Room[];
}

const RoomFloorMap3D: React.FC<RoomFloorMap3DProps> = ({ rooms }) => {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  if (rooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[520px] text-slate-500 gap-3 bg-slate-900/30 rounded-xl border border-slate-700">
        <Building2 className="h-12 w-12 opacity-30" />
        <p>No rooms to display in 3D view</p>
      </div>
    );
  }

  return (
    <div className="relative rounded-xl overflow-hidden border border-slate-700 shadow-2xl" style={{ height: 560 }}>
      <StatsBar rooms={rooms} />

      <Canvas
        shadows
        gl={{ antialias: true, alpha: false }}
        style={{ background: "linear-gradient(180deg,#0a0f1e 0%,#0f172a 60%,#111827 100%)" }}
      >
        <Suspense fallback={null}>
          <BuildingScene
            rooms={rooms}
            selectedRoom={selectedRoom}
            onRoomClick={(room) =>
              setSelectedRoom((prev) => (prev?.id === room.id ? null : room))
            }
          />
        </Suspense>
      </Canvas>

      {selectedRoom && (
        <RoomDetailPanel room={selectedRoom} onClose={() => setSelectedRoom(null)} />
      )}

      <Legend />

      {/* Controls hint */}
      <div className="absolute bottom-4 right-4 z-10 text-[10px] text-slate-600 text-right leading-tight">
        <div>Drag to rotate · Scroll to zoom</div>
        <div>Right-drag to pan</div>
      </div>
    </div>
  );
};

export default RoomFloorMap3D;
