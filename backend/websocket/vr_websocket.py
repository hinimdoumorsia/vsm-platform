import asyncio
import json
import random
from typing import Any, Dict, List

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter()

BASE_MACHINES = [
    {
        'id': 'machine-01',
        'name': 'Pressionneur A1',
        'position': {'x': -6, 'y': 0, 'z': -4},
        'base_temperature': 72.5,
        'base_vibration': 0.22,
    },
    {
        'id': 'machine-02',
        'name': 'Broyeur B4',
        'position': {'x': 0, 'y': 0, 'z': -1.5},
        'base_temperature': 64.2,
        'base_vibration': 0.18,
    },
    {
        'id': 'machine-03',
        'name': 'Convoyeur C2',
        'position': {'x': 5, 'y': 0, 'z': 2.5},
        'base_temperature': 58.4,
        'base_vibration': 0.12,
    },
]


def jitter(value: float, amplitude: float) -> float:
    return round(max(0.0, value + random.uniform(-amplitude, amplitude)), 2)


def status_from_health(health: int) -> str:
    if health < 45:
        return 'critical'
    if health < 70:
        return 'warning'
    return 'ok'


def build_machine_state(machine: Dict[str, Any]) -> Dict[str, Any]:
    temperature = jitter(machine['base_temperature'], 4.0)
    vibration = jitter(machine['base_vibration'], 0.12)
    prediction = 'STABLE'
    health = int(max(0, min(100, 100 - (temperature - 45) * 0.8 - vibration * 60)))

    if health < 60:
        prediction = 'DEGRADATION PROBABLE'
    if health < 40:
        prediction = 'ÉTAT CRITIQUE'

    return {
        'id': machine['id'],
        'name': machine['name'],
        'position': machine['position'],
        'temperature': temperature,
        'vibration': vibration,
        'prediction': prediction,
        'health': health,
        'status': status_from_health(health),
    }


@router.websocket('/ws/telemetry')
async def telemetry_socket(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            payload = {
                'machines': [build_machine_state(machine) for machine in BASE_MACHINES],
                'timestamp': int(asyncio.get_event_loop().time()),
            }
            await websocket.send_text(json.dumps(payload))
            await asyncio.sleep(2)
    except WebSocketDisconnect:
        pass
