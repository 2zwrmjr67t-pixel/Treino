#!/usr/bin/env python3
"""Busca os registros enviados pelo app ao ntfy.sh e grava em treinos.json.

Fluxo: app -> ntfy.sh/<TOPIC> (POST anônimo) -> este script (GitHub Actions, a cada 15 min) -> treinos.json.
O tópico é público: tudo que chega é tratado como dado não confiável e validado antes de gravar.
"""
import json, os, re, sys, time, urllib.request

TOPIC = os.environ.get("NTFY_TOPIC", "pg-ca2a704c401a6f81")
BASE = "https://ntfy.sh/" + TOPIC
OUT = os.environ.get("OUT_FILE", "treinos.json")
DATE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
TS = re.compile(r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}")


def clip(v, n):
    return str(v)[:n] if v is not None else None


def num(v, lo, hi):
    try:
        f = float(v)
    except (TypeError, ValueError):
        return None
    return f if lo <= f <= hi else None


def clean(p):
    """Devolve o registro validado ou None."""
    if not isinstance(p, dict) or p.get("v") != 1:
        return None
    t, cid = p.get("t"), clip(p.get("id"), 40)
    if not cid or not re.match(r"^[A-Za-z0-9_-]+$", cid):
        return None
    if t == "treino":
        if not DATE.match(str(p.get("d", ""))):
            return None
        ex = []
        for e in (p.get("ex") or [])[:15]:
            if isinstance(e, list) and len(e) >= 3:
                ex.append([clip(e[0], 40), num(e[1], 0, 500), 1 if e[2] else 0])
        return {"t": "treino", "id": cid, "d": p["d"], "dia": clip(p.get("dia"), 30),
                "ini": clip(p.get("ini"), 5), "dur": num(p.get("dur"), 0, 300), "ex": ex}
    if t == "cardio":
        if not DATE.match(str(p.get("d", ""))):
            return None
        return {"t": "cardio", "id": cid, "d": p["d"], "sess": clip(p.get("sess"), 40),
                "pico": num(p.get("pico"), 60, 230), "fc1": num(p.get("fc1"), 40, 230),
                "obs": clip(p.get("obs"), 200)}
    if t == "dieta":
        if not TS.match(str(p.get("ts", ""))):
            return None
        txt = clip(p.get("texto"), 1500)
        if not txt or not txt.strip():
            return None
        return {"t": "dieta", "id": cid, "d": p["ts"][:10], "ts": p["ts"][:16], "texto": txt.strip()}
    if t == "teste":
        return {"t": "teste", "id": cid, "ts": time.strftime("%Y-%m-%dT%H:%M")}
    return None


def main():
    db = {"registros": [], "ultimoId": None}
    if os.path.exists(OUT):
        with open(OUT, encoding="utf-8") as f:
            db.update(json.load(f))
    since = db.get("ultimoId") or "all"
    url = BASE + "/json?poll=1&since=" + since
    with urllib.request.urlopen(url, timeout=30) as r:
        lines = r.read().decode("utf-8").splitlines()
    seen = {x.get("id") for x in db["registros"]}
    seen.add(db.get("ultimoTesteId"))
    novos = 0
    for ln in lines:
        try:
            m = json.loads(ln)
        except ValueError:
            continue
        if m.get("event") != "message":
            continue
        db["ultimoId"] = m.get("id") or db["ultimoId"]
        try:
            rec = clean(json.loads(m.get("message", "")))
        except ValueError:
            rec = None
        if not rec or rec["id"] in seen:
            continue
        rec["recebido"] = time.strftime("%Y-%m-%dT%H:%M", time.gmtime(m.get("time", time.time())))
        if rec["t"] == "teste":
            db["ultimoTeste"] = rec["recebido"]
            db["ultimoTesteId"] = rec["id"]
        else:
            db["registros"].append(rec)
        seen.add(rec["id"])
        novos += 1
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(db, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print(f"{novos} registro(s) novo(s)")


if __name__ == "__main__":
    sys.exit(main())
