import sys
from pathlib import Path

backend_path = Path(__file__).resolve().parent
sys.path.append(str(backend_path))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from websocket.vr_websocket import router as vr_router

app = FastAPI(
    title='Predictive Maintenance VR Telemetry API',
    description='FastAPI backend pour diffuser la télémétrie des machines en WebSocket',
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(vr_router)

@app.get('/')
async def read_root():
    return {
        'status': 'ok',
        'description': 'Backend FastAPI VR telemetry actif',
        'websocket': '/ws/telemetry',
    }

if __name__ == '__main__':
    import uvicorn

    uvicorn.run('backend.main:app', host='0.0.0.0', port=8000, reload=True)
