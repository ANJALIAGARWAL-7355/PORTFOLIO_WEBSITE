import threading
import time
from collections import defaultdict, deque
from typing import Deque, Dict, Optional


class SlidingWindowRateLimiter:
    def __init__(
        self,
        max_requests: int,
        window_seconds: int,
        clock=time.monotonic,
    ) -> None:
        if max_requests < 1:
            raise ValueError("max_requests must be greater than zero")
        if window_seconds < 1:
            raise ValueError("window_seconds must be greater than zero")
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self._clock = clock
        self._events: Dict[str, Deque[float]] = defaultdict(deque)
        self._lock = threading.Lock()
        self._calls = 0

    def allow(self, key: str) -> bool:
        if not key:
            raise ValueError("a rate-limit key is required")
        now = self._clock()
        cutoff = now - self.window_seconds
        with self._lock:
            events = self._events[key]
            while events and events[0] <= cutoff:
                events.popleft()
            if len(events) >= self.max_requests:
                return False
            events.append(now)
            self._calls += 1
            if self._calls % 64 == 0:
                self._remove_expired_keys(cutoff, key)
            return True

    def remaining(self, key: str) -> int:
        now = self._clock()
        cutoff = now - self.window_seconds
        with self._lock:
            events = self._events.get(key, deque())
            while events and events[0] <= cutoff:
                events.popleft()
            return max(0, self.max_requests - len(events))

    def reset(self, key: Optional[str] = None) -> None:
        with self._lock:
            if key is None:
                self._events.clear()
            else:
                self._events.pop(key, None)

    def _remove_expired_keys(self, cutoff: float, current_key: str) -> None:
        for key in list(self._events):
            if key == current_key:
                continue
            events = self._events[key]
            while events and events[0] <= cutoff:
                events.popleft()
            if not events:
                del self._events[key]
