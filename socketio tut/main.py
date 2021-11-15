import socketio
import eventlet
sio = socketio.Server()
app = socketio.WSGIApp(sio)



@sio.on('message')
def another_event(sid, data):
    print(sid)
    print(data)

eventlet.wsgi.server(eventlet.listen(('127.0.0.1', 8000)), app)