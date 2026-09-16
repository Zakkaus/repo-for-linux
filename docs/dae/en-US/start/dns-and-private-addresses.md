---
title: DNS and private addresses
---

# DNS and private addresses

## dae as a DNS server

dae transparently intercepts all UDP traffic to port 53 and sniffs DNS by default. Setting `dns.bind`, for example to `'127.0.0.1:5353'`, also makes dae listen for DNS queries. The built-in `asis` outbound queries the request's original destination. When using `asis`, do not point LAN devices at `dae:53`: queries can loop.

An `udp://` or `tcp+udp://` upstream retries truncated answers (`TC=1`) over TCP. `asis` instead passes the answer through unchanged and leaves retries to the client. Other schemes keep their declared transport.

`global.bootstrap_resolver` only serves lookups needed before dae's own DNS routing is ready: DNS upstream hostname resolution and `dial_mode: real-domain` probes. If unset, dae uses `119.29.29.29:53`, then `223.5.5.5:53`. Setting it replaces both defaults, as in this upstream example:

```shell
global {
  bootstrap_resolver: '9.9.9.9:53'
}
```

## Private addresses use direct connections by default

The bundled `example.dae` and the upstream minimal configuration include the following rule to send traffic to private addresses directly. The built-in `geoip:private` set includes RFC 1918, loopback and link-local addresses.

```shell
dip(geoip:private) -> direct
```

This is a configuration default, not a hard-coded exclusion in the eBPF data plane or the control plane. Removing this rule removes that direct-routing guarantee: traffic to these addresses can then enter the proxy according to the remaining routing rules.

See [DNS configuration](/dae/configuration/dns) and [routing configuration](/dae/configuration/routing) for details.
