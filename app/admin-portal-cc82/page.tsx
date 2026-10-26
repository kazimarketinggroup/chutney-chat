'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Lock,
  Unlock,
  Download,
  RefreshCw,
  Search,
  CheckCircle2,
  Clock,
  Ticket,
  Users,
  Building2,
  Briefcase,
  Mail,
  Phone,
  ExternalLink,
  X,
  LogOut,
  Calendar,
  DollarSign,
  ShieldAlert,
  Eye,
  EyeOff,
  Copy,
  Check,
  Printer,
  TrendingUp,
  Sparkles,
  Filter,
  ArrowUpDown,
  Grid,
  List,
  UserCheck,
  MapPin,
  CreditCard,
  ChevronRight,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';
import { downloadTicketPDF } from '@/lib/downloadTicketPDF';

const LOGO_SRC = '/images/c302ccd7d7909e70a9f99958bd6d760971083375.png';
const HERO_BG = '/images/homepage_hero_image.png';

interface GuestDetail {
  name: string;
  email: string;
  company?: string;
  role?: string;
}

interface BookingItem {
  id: string;
  ticketNumber: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  quantity: number;
  status: 'paid' | 'pending' | 'failed' | 'refunded' | 'expired';
  amountPence: number;
  amountFormatted: string;
  currency: string;
  eventTitle: string;
  eventVenue: string;
  eventDate: string;
  eventEndsAt?: string;
  stripePaymentIntentId: string;
  paidAt: string | null;
  createdAt: string;
  guestDetails: GuestDetail[];
}

interface DashboardStats {
  totalRevenue: string;
  totalRevenuePence?: number;
  totalTicketsSold: number;
  paidBookingsCount: number;
  pendingBookingsCount: number;
  failedBookingsCount?: number;
  totalBookingsCount: number;
  averageOrderValue?: string;
  conversionRate?: number;
  uniqueCompaniesCount?: number;
  eventsList?: string[];
}

interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'error';
}

const AVATAR_PALETTE = [
  { bg: '#e7ecdf', text: '#3c4b31' },
  { bg: '#eee6dd', text: '#5a3d28' },
  { bg: '#e8e5ee', text: '#433857' },
  { bg: '#e0ebed', text: '#274b52' },
  { bg: '#f1e4db', text: '#61361c' },
  { bg: '#e5e9df', text: '#3c4e33' },
  { bg: '#eae6de', text: '#534e3a' },
  { bg: '#e4e9f0', text: '#2f435e' },
];

function getAvatarStyle(name: string) {
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_PALETTE.length;
  return AVATAR_PALETTE[index];
}

const ADMIN_PORTAL_CSS = `
:root {
  --bg: #f5f4ef;
  --paper: #fffefa;
  --ink: #242923;
  --muted: #72786c;
  --border: #e3e5dc;
  --orange: #da641f;
  --green: #347052;
  --side: #20271f;
}
.admin-workspace {
  margin: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  background: var(--bg);
  color: var(--ink);
  min-height: 100vh;
}
.admin-workspace * {
  box-sizing: border-box;
}
.admin-workspace button, .admin-workspace input, .admin-workspace select {
  font: inherit;
}
.admin-workspace button {
  cursor: pointer;
  color: inherit;
}
.admin-workspace button, .admin-workspace a, .admin-workspace input, .admin-workspace select {
  touch-action: manipulation;
}
.admin-workspace button:focus-visible, .admin-workspace a:focus-visible, .admin-workspace input:focus-visible, .admin-workspace select:focus-visible {
  outline: 3px solid #da641f88;
  outline-offset: 3px;
}
.admin-workspace svg {
  width: 19px;
  height: 19px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
  flex-shrink: 0;
}
.sidebar {
  width: 238px;
  position: fixed;
  inset: 0 auto 0 0;
  background: var(--side);
  color: #c1c9bb;
  display: flex;
  flex-direction: column;
  padding: 32px 20px;
  z-index: 20;
  transition: transform .2s ease;
}
.brand {
  padding: 0 5px 33px;
}
.brand img {
  width: 190px;
  height: auto;
}
.fallback {
  font-size: 20px;
  letter-spacing: -.8px;
  color: #f0f0e7;
  font-weight: 800;
}
.fallback b { color: #ff994f; }
.fallback small {
  display: block;
  font-weight: 400;
  letter-spacing: 2px;
  font-size: 8px;
  margin-top: 3px;
  color: #bfc4b6;
}
.workspace {
  border: 1px solid #41483c;
  border-radius: 10px;
  padding: 12px;
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 36px;
}
.workspace .mark {
  background: #36402f;
  border: 1px solid #566148;
  padding: 6px;
  border-radius: 7px;
  color: #d8decf;
}
.workspace strong {
  display: block;
  color: #f1f2e9;
  font-size: 12px;
}
.workspace small {
  font-size: 10px;
  color: #a4ae9b;
}
.nav-label {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1.8px;
  padding: 0 14px;
  margin-bottom: 11px;
  color: #9ba58f;
}
.nav {
  display: grid;
  gap: 6px;
}
.nav button {
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #c0c9b6;
  display: flex;
  align-items: center;
  gap: 12px;
  text-align: left;
  padding: 13px;
  font-size: 12px;
  width: 100%;
}
.nav button:hover {
  background: #ffffff08;
}
.nav button.active {
  background: #e4ebd4;
  color: #273321;
  font-weight: 650;
}
.nav .count {
  margin-left: auto;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.2);
  padding: 1px 6px;
  font-size: 10px;
  font-weight: 700;
}
.nav button.active .count {
  background: #273321;
  color: #e4ebd4;
}
.side-note {
  margin-top: auto;
  background: linear-gradient(130deg, #35402d, #2a3325);
  border: 1px solid #46513d;
  padding: 19px 15px;
  border-radius: 12px;
}
.side-note svg {
  color: #cfdbb5;
}
.side-note h3 {
  font: 22px/1.25 Georgia, serif;
  color: #f0f2e9;
  margin: 12px 0 9px;
}
.side-note p {
  font-size: 11px;
  color: #b9c3ad;
  margin: 0;
}
.account {
  display: flex;
  align-items: center;
  gap: 10px;
  border-top: 1px solid #3c4435;
  margin-top: 25px;
  padding-top: 23px;
}
.account strong {
  font-size: 11px;
  color: #ecefe4;
  display: block;
}
.account small {
  font-size: 10px;
  color: #b0b9a5;
}
.avatar {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  font-size: 11px;
  font-weight: 650;
  flex-shrink: 0;
  background: #e8ebdf;
  color: #546143;
}
.account .avatar {
  background: #6b795a;
  color: white;
}
.shell {
  margin-left: 238px;
}
.topbar {
  height: 78px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 42px;
  gap: 18px;
  background: #fafbf6;
}
.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 11px;
  color: var(--muted);
}
.breadcrumbs strong {
  color: var(--ink);
  font-weight: 500;
}
.top-right {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 10px;
  color: var(--muted);
}
.live-pill {
  border: 1px solid #c2dbcd;
  background: #eaf5ee;
  color: #276241;
  padding: 4px 9px;
  border-radius: 5px;
  letter-spacing: .8px;
  font-size: 9px;
  font-weight: bold;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
.live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #276241;
}
.icon-btn {
  display: grid;
  place-items: center;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--paper);
  width: 35px;
  height: 35px;
  color: #555d4c;
}
.icon-btn:hover {
  background: #eceee4;
}
.mobile-menu {
  display: none;
}
.main {
  max-width: 1600px;
  margin: auto;
  padding: 35px 42px;
}
.heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 28px;
}
.eyebrow {
  font-size: 10px;
  letter-spacing: 1.7px;
  color: #797e70;
  font-weight: 600;
  text-transform: uppercase;
  margin: 0 0 7px;
}
.admin-workspace h1 {
  font-size: 31px;
  font-weight: 550;
  letter-spacing: -1.2px;
  line-height: 1.2;
  margin: 0 0 9px;
  color: var(--ink);
}
.subtitle {
  font-size: 12px;
  color: var(--muted);
  margin: 0;
}
.actions {
  display: flex;
  align-items: center;
  gap: 9px;
}
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid #daddd1;
  border-radius: 8px;
  padding: 10px 14px;
  background: var(--paper);
  font-weight: 550;
  font-size: 11px;
  white-space: nowrap;
}
.btn svg {
  width: 15px;
  height: 15px;
}
.btn:hover {
  background: #eceee4;
}
.btn.primary {
  background: var(--orange);
  color: white;
  border-color: var(--orange);
  box-shadow: 0 2px 3px rgba(166, 67, 24, 0.15);
}
.btn.primary:hover {
  background: #bb5115;
}
.metrics {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 23px;
}
.metric {
  padding: 23px;
  background: var(--paper);
  border: 1px solid var(--border);
  border-radius: 12px;
}
.metric:first-child {
  background: #e9edde;
  border-color: #dfe4d2;
}
.metric-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #626c57;
  font-size: 11px;
}
.metric-top svg {
  width: 17px;
  height: 17px;
  color: #7f8a70;
}
.metric-value {
  font-size: 31px;
  letter-spacing: -1px;
  line-height: 1.25;
  font-weight: 550;
  margin: 16px 0 9px;
  font-variant-numeric: tabular-nums;
  color: var(--ink);
}
.metric small {
  color: #6f7765;
  font-size: 10px;
}
.metric small strong {
  font-weight: 550;
  color: #3f6649;
}
.overview-strip {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 22px;
  margin-bottom: 28px;
}
.event-card {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  padding: 24px 26px;
  background: #272f23;
  color: #f1f3ea;
  display: flex;
  gap: 23px;
  align-items: center;
}
.date-tile {
  border: 1px solid #646c52;
  border-radius: 10px;
  text-align: center;
  padding: 8px 14px;
  position: relative;
  z-index: 1;
  background: #323c2b;
  min-width: 58px;
}
.date-tile small {
  font-size: 9px;
  letter-spacing: 1.5px;
  color: #c8d6b5;
  display: block;
}
.date-tile strong {
  font: 32px/1.2 Georgia, serif;
  display: block;
}
.event-copy {
  z-index: 1;
}
.event-copy .eyebrow {
  color: #b6c6a1;
  font-size: 8px;
  letter-spacing: 1.8px;
}
.event-copy h2 {
  font-family: Georgia, serif;
  font-weight: 400;
  font-size: 24px;
  letter-spacing: -.4px;
  margin: 5px 0;
  color: #f1f3ea;
}
.event-copy p {
  margin: 0;
  color: #c1ccb4;
  font-size: 10px;
}
.event-card:after {
  content: '';
  position: absolute;
  right: -45px;
  top: -65px;
  width: 230px;
  height: 230px;
  border: 1px solid #63714e;
  border-radius: 50%;
  box-shadow: 0 0 0 24px rgba(99, 113, 78, 0.07), 0 0 0 48px rgba(99, 113, 78, 0.04);
  pointer-events: none;
}
.event-card button {
  z-index: 1;
  margin-left: auto;
  border-color: #63714e;
  background: transparent;
  color: #e7eeda;
}
.progress-card {
  border: 1px solid var(--border);
  background: var(--paper);
  border-radius: 12px;
  padding: 21px 24px;
}
.progress-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.progress-top h2 {
  font-size: 12px;
  margin: 0;
  font-weight: 600;
  color: var(--ink);
}
.progress-top span {
  font-size: 11px;
  color: var(--green);
  font-weight: 600;
}
.progress-track {
  height: 6px;
  background: #eceee4;
  border-radius: 20px;
  margin: 17px 0 14px;
  overflow: hidden;
}
.progress-track > div {
  height: 100%;
  background: #7b8f61;
  border-radius: 20px;
  transition: width .3s;
}
.progress-bottom {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: var(--muted);
}
.progress-bottom strong {
  color: var(--ink);
  font-weight: 600;
}
.roster {
  border: 1px solid var(--border);
  background: var(--paper);
  border-radius: 13px;
  overflow: hidden;
}
.roster-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 23px 24px 20px;
  gap: 14px;
}
.roster-title h2 {
  font-size: 17px;
  letter-spacing: -.3px;
  margin: 0;
  font-weight: 600;
  color: var(--ink);
}
.roster-title p {
  margin: 5px 0 0;
  color: var(--muted);
  font-size: 11px;
}
.view-switch {
  display: flex;
  border: 1px solid var(--border);
  border-radius: 7px;
  padding: 3px;
  gap: 3px;
}
.view-switch button {
  border: 0;
  background: transparent;
  border-radius: 4px;
  padding: 6px 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #737b69;
  font-size: 10px;
}
.view-switch button.active {
  background: #eeefe8;
  color: #333c2c;
  font-weight: 600;
}
.view-switch svg {
  width: 14px;
  height: 14px;
}
.toolbar {
  display: flex;
  gap: 10px;
  padding: 0 24px 20px;
  align-items: center;
}
.search {
  display: flex;
  align-items: center;
  gap: 9px;
  border: 1px solid var(--border);
  border-radius: 7px;
  padding: 0 12px;
  flex: 1;
  min-width: 0;
  max-width: 430px;
  background: #fff;
}
.search svg {
  width: 16px;
  color: #8b9281;
}
.search input {
  border: 0;
  background: transparent;
  width: 100%;
  min-width: 0;
  outline: 0;
  padding: 11px 0;
  font-size: 11px;
  color: var(--ink);
}
.search:focus-within {
  outline: 2px solid #da641f66;
}
.search kbd {
  font-size: 9px;
  background: #f5f6f0;
  border: 1px solid var(--border);
  border-radius: 3px;
  padding: 1px 4px;
  color: #919786;
}
.toolbar select {
  max-width: 220px;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 7px;
  padding: 10px;
  font-size: 11px;
  color: #505847;
}
.toolbar .sort {
  margin-left: auto;
}
.tabs {
  display: flex;
  gap: 24px;
  padding: 0 24px;
  border-bottom: 1px solid var(--border);
}
.tabs button {
  border: 0;
  background: transparent;
  border-bottom: 2px solid transparent;
  padding: 0 0 14px;
  font-size: 11px;
  color: #727a68;
  display: flex;
  gap: 7px;
  align-items: center;
}
.tabs button.active {
  border-color: var(--orange);
  color: #b84b12;
  font-weight: 600;
}
.tabs span {
  background: #eff0e9;
  color: #657057;
  border-radius: 5px;
  padding: 1px 5px;
  font-size: 9px;
}
.tabs .active span {
  background: #fae9df;
  color: #a54a1b;
}
.table-wrap {
  overflow: auto;
}
.admin-workspace table {
  width: 100%;
  border-collapse: collapse;
  white-space: nowrap;
  text-align: left;
}
.admin-workspace th {
  background: #f8f9f4;
  color: #858b7c;
  font-size: 9px;
  letter-spacing: .6px;
  font-weight: 500;
  padding: 13px 18px;
  border-bottom: 1px solid var(--border);
}
.admin-workspace td {
  padding: 17px 18px;
  border-bottom: 1px solid #eceee5;
  font-size: 11px;
}
.admin-workspace th:first-child, .admin-workspace td:first-child {
  padding-left: 24px;
}
.admin-workspace tbody tr:last-child td {
  border: 0;
}
.admin-workspace tbody tr:hover {
  background: #f8f9f3;
}
.person {
  display: flex;
  align-items: center;
  gap: 11px;
}
.person strong {
  display: block;
  font-size: 11px;
  font-weight: 600;
  color: var(--ink);
}
.person small {
  color: var(--muted);
  font-size: 10px;
  display: block;
  margin-top: 3px;
}
.event-name {
  font-size: 10px;
  display: block;
}
.ref {
  font: 9px/1.5 ui-monospace, SFMono-Regular, Consolas, monospace;
  color: #8b907f;
  margin-top: 4px;
  display: block;
}
.status {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 8px;
  border-radius: 5px;
  background: #edf4ec;
  color: #37664a;
  font-size: 9px;
  font-weight: 500;
}
.status:before {
  content: '';
  height: 4px;
  width: 4px;
  border-radius: 50%;
  background: currentColor;
}
.status.pending {
  background: #fcf1db;
  color: #946c21;
}
.amount {
  font-weight: 550;
  font-variant-numeric: tabular-nums;
}
.check-btn {
  border: 1px solid #dce2d1;
  border-radius: 6px;
  padding: 6px 8px;
  background: #fff;
  color: #526944;
  font-size: 10px;
  display: inline-flex;
  gap: 5px;
  align-items: center;
  min-width: 84px;
  justify-content: center;
  transition: all .15s ease;
}
.check-btn svg {
  width: 12px;
  height: 12px;
}
.check-btn.done {
  background: #edf3e4;
  border-color: #dce6d0;
  font-weight: 600;
}
.check-btn:disabled {
  background: #f4f4ef;
  color: #919584;
  cursor: not-allowed;
  border-color: #e8e9e1;
}
.detail-btn {
  border: 0;
  background: transparent;
  color: #7f8874;
  display: grid;
  place-items: center;
  border-radius: 5px;
  width: 28px;
  height: 28px;
}
.detail-btn:hover {
  background: #e9eddf;
}
.table-footer {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  padding: 17px 24px;
  border-top: 1px solid var(--border);
  color: #7a816e;
  font-size: 10px;
}
.table-footer strong {
  color: #45503c;
  font-weight: 550;
}
.bottom {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  color: #89907e;
  font-size: 9px;
  padding: 22px 1px;
}
.bottom b {
  font-weight: 500;
  color: #5c6751;
}
.cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 15px;
  padding: 22px;
}
.guest-card {
  border: 1px solid var(--border);
  border-radius: 9px;
  padding: 18px;
  min-width: 0;
  background: #fff;
}
.guest-card .person {
  margin-bottom: 16px;
}
.guest-card .person small {
  overflow-wrap: anywhere;
}
.guest-card .card-meta {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin: 15px 0;
}
.guest-card footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--border);
  padding-top: 14px;
}
.empty {
  text-align: center;
  padding: 50px 24px;
  color: var(--muted);
}
.empty h3 {
  color: var(--ink);
  font-size: 16px;
  margin: 0 0 6px;
}
.empty p {
  margin: 0 0 16px;
  font-size: 12px;
}
.door-banner {
  background: #eaf0e0;
  border: 1px solid #d6dfc7;
  border-radius: 10px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 22px;
  font-size: 12px;
}
.door-banner svg {
  color: #347052;
}
.door-banner p {
  margin: 0;
}
.door-banner small {
  display: block;
  color: #69775b;
  margin-top: 3px;
}
.drawer-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(27, 37, 28, 0.45);
  backdrop-filter: blur(3px);
  z-index: 50;
}
.drawer-panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: min(480px, 100%);
  background: var(--paper);
  color: var(--ink);
  box-shadow: -15px 0 70px rgba(29, 39, 27, 0.18);
  border-left: 1px solid var(--border);
  z-index: 51;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}
.drawer-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid var(--border);
  font-size: 11px;
  color: var(--muted);
}
.drawer-body {
  padding: 30px;
}
.drawer-body > .avatar {
  height: 62px;
  width: 62px;
  font-size: 19px;
  margin-bottom: 20px;
}
.drawer-body h2 {
  font-size: 27px;
  letter-spacing: -.7px;
  margin: 0 0 5px;
  color: var(--ink);
}
.drawer-body > p {
  color: var(--muted);
  font-size: 12px;
  margin: 0 0 20px;
  overflow-wrap: anywhere;
}
.drawer-body h3 {
  font-size: 10px;
  letter-spacing: 1.3px;
  margin-top: 28px;
  margin-bottom: 10px;
  color: var(--muted);
}
.admin-workspace dl {
  margin: 0;
}
.admin-workspace dl > div {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 13px 0;
  border-bottom: 1px solid var(--border);
  font-size: 12px;
}
.admin-workspace dt {
  color: var(--muted);
}
.admin-workspace dd {
  margin: 0;
  text-align: right;
  font-weight: 500;
  color: var(--ink);
}
.drawer-check-btn {
  margin-top: 24px;
  width: 100%;
  padding: 12px;
}
.drawer-pdf-btn {
  margin-top: 10px;
  width: 100%;
  padding: 12px;
}
.drawer-note {
  font-size: 10px !important;
  margin-top: 16px !important;
  color: var(--muted);
  text-align: center;
}
.toast {
  position: fixed;
  bottom: 24px;
  left: calc(50% + 119px);
  transform: translateX(-50%);
  background: #273421;
  color: #fff;
  padding: 12px 20px;
  border-radius: 9px;
  box-shadow: 0 7px 30px rgba(0, 0, 0, 0.2);
  font-size: 12px;
  z-index: 100;
  width: max-content;
  max-width: calc(100% - 32px);
}
.door-mode .check-btn {
  padding: 11px 15px;
  min-width: 110px;
}
.door-mode .overview-strip, .door-mode .metrics {
  display: none;
}
.guest-mode .overview-strip {
  display: none;
}
.nav-overlay {
  display: none;
}
@media (min-width: 1600px) {
  .main { padding-top: 43px; }
  .metric { padding: 26px; }
  .metric-value { font-size: 36px; }
  .admin-workspace td { padding-top: 20px; padding-bottom: 20px; }
}
@media (max-width: 1200px) {
  .sidebar { width: 205px; padding: 27px 15px; }
  .brand img { width: 172px; }
  .fallback { font-size: 18px; }
  .shell { margin-left: 205px; }
  .main { padding: 28px 25px; }
  .topbar { padding: 0 25px; }
  .overview-strip { grid-template-columns: 1fr 1fr; gap: 15px; }
  .event-card { padding: 20px; gap: 15px; }
  .event-copy h2 { font-size: 20px; }
  .event-card button { display: none; }
  .metric { padding: 18px; }
  .metric-value { font-size: 28px; }
  .toast { left: calc(50% + 102px); }
  .admin-workspace th, .admin-workspace td { padding-left: 12px; padding-right: 12px; }
  .cards { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .company-col { display: none; }
}
@media (max-width: 900px) {
  .sidebar { transform: translateX(-100%); width: 238px; }
  .sidebar.open { transform: translateX(0); }
  .shell { margin-left: 0; }
  .mobile-menu { display: grid; }
  .topbar { height: 65px; }
  .top-right time { display: none; }
  .breadcrumbs { margin-right: auto; }
  .main { padding: 25px 22px; }
  .toast { left: 50%; }
  .nav-overlay.open { display: block; position: fixed; inset: 0; background: rgba(0, 0, 0, 0.4); z-index: 19; border: 0; }
  .metric-value { font-size: 27px; }
  .heading { gap: 12px; }
  .metrics { gap: 10px; }
  .event-copy h2 { font-size: 21px; }
}
@media (max-width: 600px) {
  .topbar { padding: 0 18px; gap: 12px; }
  .breadcrumbs { font-size: 10px; }
  .breadcrumbs > span:first-child, .breadcrumbs > span:nth-child(2) { display: none; }
  .top-right { gap: 8px; }
  .heading { align-items: flex-start; flex-direction: column; margin-bottom: 22px; }
  .heading .actions { width: 100%; }
  .heading .actions .btn { flex: 1; }
  .admin-workspace h1 { font-size: 28px; }
  .main { padding: 24px 15px; }
  .metrics { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
  .metric { padding: 16px; }
  .metric-top { font-size: 10px; }
  .metric-value { margin: 11px 0 7px; }
  .metric small { font-size: 9px; }
  .overview-strip { grid-template-columns: 1fr; gap: 12px; }
  .event-card { padding: 21px; }
  .progress-card { padding: 18px; }
  .roster-title { padding: 19px 16px; }
  .roster-title h2 { font-size: 16px; }
  .view-switch button { padding: 7px; }
  .view-switch button span { display: none; }
  .toolbar { padding: 0 16px 16px; flex-wrap: wrap; gap: 8px; }
  .search { max-width: none; flex-basis: 100%; }
  .toolbar select { flex: 1; min-width: 0; font-size: 10px; }
  .toolbar .sort { margin: 0; }
  .tabs { gap: 17px; padding: 0 16px; }
  .tabs button { font-size: 10px; }
  .cards { grid-template-columns: 1fr; padding: 15px; gap: 10px; }
  .table-footer { padding: 14px 16px; font-size: 9px; flex-wrap: wrap; }
  .bottom { font-size: 8px; }
  .door-banner { font-size: 11px; }
}
@media print {
  .sidebar, .topbar, .heading .actions, .overview-strip, .metrics, .toolbar, .tabs, .view-switch, .bottom, .toast, .door-banner, .detail-btn, .check-btn, .drawer-backdrop, .drawer-panel {
    display: none !important;
  }
  .shell { margin: 0 !important; }
  .main { padding: 0 !important; }
  .roster { border: 0 !important; }
  .table-wrap { overflow: visible !important; }
  body { background: white !important; font-size: 10px !important; }
  .admin-workspace th, .admin-workspace td { padding: 10px !important; }
  .cards { grid-template-columns: repeat(2, 1fr) !important; }
  .guest-card { break-inside: avoid !important; }
}
@media (prefers-reduced-motion: reduce) {
  * { transition: none !important; }
}
`;

function AdminSvgDefs() {
  return (
    <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
      <defs>
        <symbol id="icon-grid" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></symbol>
        <symbol id="icon-users" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6m2 4a5 5 0 0 1 3 5"/></symbol>
        <symbol id="icon-door" viewBox="0 0 24 24"><path d="M3 21h18M6 21V3h12v18M14 12h.01"/></symbol>
        <symbol id="icon-arrow" viewBox="0 0 24 24"><path d="M4 12h16m-6-6 6 6-6 6"/></symbol>
        <symbol id="icon-check" viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></symbol>
        <symbol id="icon-search" viewBox="0 0 24 24"><circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/></symbol>
        <symbol id="icon-download" viewBox="0 0 24 24"><path d="M12 3v12m-4-4 4 4 4-4M4 16v5h16v-5"/></symbol>
        <symbol id="icon-print" viewBox="0 0 24 24"><path d="M7 7V3h10v4M7 17H3V8h18v9h-4M7 14h10v7H7zM17 11h1"/></symbol>
        <symbol id="icon-list" viewBox="0 0 24 24"><path d="M8 5h13M8 12h13M8 19h13M3 5h.01M3 12h.01M3 19h.01"/></symbol>
        <symbol id="icon-ticket" viewBox="0 0 24 24"><path d="M3 5h18v5a2 2 0 0 0 0 4v5H3v-5a2 2 0 0 0 0-4zM15 5v3m0 3v2m0 3v3"/></symbol>
        <symbol id="icon-pound" viewBox="0 0 24 24"><path d="M17 6c-1-4-8-4-8 2v9l-3 3h13M6 12h9"/></symbol>
        <symbol id="icon-close" viewBox="0 0 24 24"><path d="m6 6 12 12M6 18 18 6"/></symbol>
        <symbol id="icon-refresh" viewBox="0 0 24 24"><path d="M20 9a8 8 0 0 0-14-3L3 9m0-6v6h6M4 15a8 8 0 0 0 14 3l3-3m0 6v-6h-6"/></symbol>
        <symbol id="icon-menu" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></symbol>
        <symbol id="icon-logout" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></symbol>
      </defs>
    </svg>
  );
}

function AdminIcon({ name, className = '' }: { name: string; className?: string }) {
  return (
    <svg className={className} aria-hidden="true">
      <use href={`#icon-${name}`} />
    </svg>
  );
}

function getInitials(name: string): string {
  if (!name) return 'CC';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  try {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function formatEventDate(iso: string | null | undefined): { date: string; time: string } {
  if (!iso) return { date: 'Date TBC', time: 'Time TBC' };
  try {
    const d = new Date(iso);
    return {
      date: new Intl.DateTimeFormat('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(d),
      time: new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      }).format(d),
    };
  } catch {
    return { date: iso, time: '' };
  }
}

export default function AdminPortalPage() {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  // Data State
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  // Navigation & View State (matching user's prototype)
  const [navPage, setNavPage] = useState<'overview' | 'guests' | 'door'>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Search, Filter & Sort State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending'>('all');
  const [eventFilter, setEventFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'new' | 'name' | 'amount'>('new');

  // Interactive UI State
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);
  const [checkedInIds, setCheckedInIds] = useState<Set<string>>(new Set());
  const [generatingPdfId, setGeneratingPdfId] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showHelpDialog, setShowHelpDialog] = useState(false);

  // Responsive mode default: mobile screens default to cards view
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth <= 600) {
      setViewMode('cards');
    }
  }, []);

  // Keyboard shortcut listener: "/" focuses search, "Escape" closes drawer / mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setSelectedBooking(null);
      }
      if (
        e.key === '/' &&
        !e.ctrlKey &&
        !e.metaKey &&
        !selectedBooking &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes((document.activeElement as HTMLElement)?.tagName || '')
      ) {
        e.preventDefault();
        const searchInput = document.getElementById('search') as HTMLInputElement | null;
        searchInput?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedBooking]);

  // Load checked in attendees from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('cc_checked_in_bookings');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCheckedInIds(new Set(parsed));
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleCheckIn = useCallback((bookingId: string, attendeeName: string) => {
    setCheckedInIds((prev) => {
      const next = new Set(prev);
      const isCheckingIn = !next.has(bookingId);
      if (isCheckingIn) {
        next.add(bookingId);
        addToast(`Checked in: ${attendeeName}`, 'success');
      } else {
        next.delete(bookingId);
        addToast(`Check-in reversed for ${attendeeName}`, 'info');
      }
      try {
        localStorage.setItem('cc_checked_in_bookings', JSON.stringify(Array.from(next)));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const addToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  const handleCopy = (text: string, key: string, label: string) => {
    if (!navigator?.clipboard) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    addToast(`Copied ${label} to clipboard`, 'success');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  useEffect(() => {
    fetchBookings(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setAuthError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setAuthError(data.error || 'Incorrect passcode. Please try again.');
        setLoggingIn(false);
        return;
      }

      setIsAuthenticated(true);
      fetchBookings(false);
      addToast('Welcome back, Administrator', 'success');
    } catch {
      setAuthError('Connection error. Please check your network.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/login', { method: 'DELETE' });
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
    setBookings([]);
    setStats(null);
    addToast('Signed out of admin portal', 'info');
  };

  const fetchBookings = async (isInitialCheck = false) => {
    setLoading(true);
    setFetchError(null);

    try {
      const res = await fetch('/api/admin/bookings');
      if (res.status === 401) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to load bookings.');
      }

      setIsAuthenticated(true);
      setBookings(data.bookings || []);
      setStats(data.stats || null);
      setLastRefreshed(new Date());

      if (!isInitialCheck) {
        addToast('Attendee database synced with Supabase', 'success');
      }
    } catch (err: unknown) {
      if (!isInitialCheck) {
        setFetchError(err instanceof Error ? err.message : 'Error fetching data.');
      }
    } finally {
      setLoading(false);
    }
  };

  const availableEvents = useMemo(() => {
    const set = new Set<string>();
    bookings.forEach((b) => {
      if (b.eventTitle) set.add(b.eventTitle);
    });
    return Array.from(set);
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    const filtered = bookings.filter((b) => {
      if (statusFilter === 'paid' && b.status !== 'paid') return false;
      if (statusFilter === 'pending' && b.status !== 'pending') return false;
      if (eventFilter !== 'all' && b.eventTitle !== eventFilter) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();

      const matchesPrimary =
        b.name.toLowerCase().includes(q) ||
        b.email.toLowerCase().includes(q) ||
        (b.phone && b.phone.toLowerCase().includes(q)) ||
        (b.company && b.company.toLowerCase().includes(q)) ||
        (b.role && b.role.toLowerCase().includes(q)) ||
        b.ticketNumber.toLowerCase().includes(q) ||
        (b.stripePaymentIntentId && b.stripePaymentIntentId.toLowerCase().includes(q));

      if (matchesPrimary) return true;

      return b.guestDetails.some(
        (g) =>
          (g.name && g.name.toLowerCase().includes(q)) ||
          (g.email && g.email.toLowerCase().includes(q)) ||
          (g.company && g.company.toLowerCase().includes(q)) ||
          (g.role && g.role.toLowerCase().includes(q))
      );
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'amount') return (b.amountPence || 0) - (a.amountPence || 0);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [bookings, statusFilter, eventFilter, searchQuery, sortBy]);

  const paidAttendeesTotal = useMemo(() => {
    return bookings
      .filter((b) => b.status === 'paid')
      .reduce((sum, b) => sum + (b.quantity || 1), 0);
  }, [bookings]);

  const checkedInCount = useMemo(() => {
    return bookings
      .filter((b) => b.status === 'paid' && checkedInIds.has(b.id))
      .reduce((sum, b) => sum + (b.quantity || 1), 0);
  }, [bookings, checkedInIds]);

  const scopedBookings = useMemo(() => {
    return bookings.filter((b) => eventFilter === 'all' || b.eventTitle === eventFilter);
  }, [bookings, eventFilter]);

  const scopedPaidBookings = useMemo(() => {
    return scopedBookings.filter((b) => b.status === 'paid');
  }, [scopedBookings]);

  const scopedPendingBookings = useMemo(() => {
    return scopedBookings.filter((b) => b.status === 'pending');
  }, [scopedBookings]);

  const scopedGrossRevenueFormatted = useMemo(() => {
    const totalPence = scopedPaidBookings.reduce((sum, b) => sum + (b.amountPence || 0), 0);
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(totalPence / 100);
  }, [scopedPaidBookings]);

  const scopedTicketsSold = useMemo(() => {
    return scopedPaidBookings.reduce((sum, b) => sum + (b.quantity || 1), 0);
  }, [scopedPaidBookings]);

  const scopedAovFormatted = useMemo(() => {
    if (scopedPaidBookings.length === 0) return '£0.00';
    const totalPence = scopedPaidBookings.reduce((sum, b) => sum + (b.amountPence || 0), 0);
    const avg = totalPence / scopedPaidBookings.length / 100;
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(avg);
  }, [scopedPaidBookings]);

  const scopedUniqueCompanies = useMemo(() => {
    const set = new Set<string>();
    scopedPaidBookings.forEach((b) => {
      if (b.company && b.company.trim().toLowerCase() !== 'private attendee') {
        set.add(b.company.trim().toLowerCase());
      }
    });
    return set.size;
  }, [scopedPaidBookings]);

  const scopedArrivals = useMemo(() => {
    return scopedPaidBookings.filter((b) => checkedInIds.has(b.id)).reduce((sum, b) => sum + (b.quantity || 1), 0);
  }, [scopedPaidBookings, checkedInIds]);

  const scopedCheckInPercentage = scopedTicketsSold > 0
    ? Math.round((scopedArrivals / scopedTicketsSold) * 100)
    : 0;

  const nextGathering = useMemo(() => {
    const withDates = bookings.filter((b) => b.eventDate && b.eventTitle);
    if (withDates.length > 0) {
      const sorted = [...withDates].sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
      const upcoming = sorted.find((b) => new Date(b.eventDate).getTime() >= Date.now() - 24 * 60 * 60 * 1000);
      const chosen = upcoming || sorted[sorted.length - 1];
      const d = new Date(chosen.eventDate);
      return {
        title: chosen.eventTitle,
        month: d.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase(),
        day: d.getDate(),
        fullDate: `${d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })} · ${d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`,
      };
    }
    return {
      title: 'Annual Dinner & Awards',
      month: 'NOV',
      day: 14,
      fullDate: 'Saturday, 14 November · 6:30 PM',
    };
  }, [bookings]);

  const currentDateStr = useMemo(() => {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date());
  }, []);

  const handleViewNextEvent = () => {
    setEventFilter(nextGathering.title);
    setStatusFilter('all');
    setSearchQuery('');
    setNavPage('guests');
  };

  const clearFilters = () => {
    setSearchQuery('');
    setEventFilter('all');
    setStatusFilter('all');
  };

  const handleDownloadPDF = async (b: BookingItem) => {
    setGeneratingPdfId(b.id);
    addToast(`Generating high-res ticket PDF for ${b.name}...`, 'info');

    try {
      const { date, time } = formatEventDate(b.eventDate);
      const guestsPayload =
        b.guestDetails && b.guestDetails.length > 0
          ? b.guestDetails
          : [{ name: b.name, email: b.email, company: b.company, role: b.role }];

      await downloadTicketPDF({
        ticketNumber: b.ticketNumber,
        eventTitle: b.eventTitle,
        venue: b.eventVenue,
        date: date || 'Date TBC',
        time: time || 'Evening',
        total: b.amountFormatted,
        primaryBuyer: {
          name: b.name,
          email: b.email,
          phone: b.phone,
          company: b.company,
          role: b.role,
        },
        guests: guestsPayload,
        paymentRef: b.stripePaymentIntentId,
      });

      addToast(`Official PDF ticket downloaded (${b.ticketNumber})`, 'success');
    } catch (err) {
      console.error('[admin] PDF generation error:', err);
      addToast('Failed to generate PDF. Please try again.', 'error');
    } finally {
      setGeneratingPdfId(null);
    }
  };

  const exportCSV = () => {
    if (!filteredBookings.length) {
      addToast('No bookings matching current filters to export.', 'info');
      return;
    }

    const headers = [
      'Ticket Number',
      'Status',
      'Checked In',
      'Primary Name',
      'Email',
      'Phone',
      'Company',
      'Job Role',
      'Quantity',
      'Total Paid',
      'Event Title',
      'Event Venue',
      'Event Date',
      'Created At',
      'Paid At',
      'Stripe Payment Intent ID',
      'All Guests Breakdown',
    ];

    const escapeCsv = (val: string | null | undefined) => {
      if (!val) return '""';
      return `"${String(val).replace(/"/g, '""')}"`;
    };

    const rows = filteredBookings.map((b) => {
      const isCheckedIn = checkedInIds.has(b.id) ? 'YES' : 'NO';
      const guestsSummary = b.guestDetails
        .map((g, idx) => `[Guest #${idx + 1}: ${g.name} | ${g.email} | ${g.company || '—'} | ${g.role || '—'}]`)
        .join('; ');

      return [
        escapeCsv(b.ticketNumber),
        escapeCsv(b.status.toUpperCase()),
        escapeCsv(isCheckedIn),
        escapeCsv(b.name),
        escapeCsv(b.email),
        escapeCsv(b.phone),
        escapeCsv(b.company),
        escapeCsv(b.role),
        b.quantity,
        escapeCsv(b.amountFormatted),
        escapeCsv(b.eventTitle),
        escapeCsv(b.eventVenue),
        escapeCsv(b.eventDate),
        escapeCsv(b.createdAt),
        escapeCsv(b.paidAt || 'N/A'),
        escapeCsv(b.stripePaymentIntentId),
        escapeCsv(guestsSummary),
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chutney-chat-attendees-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    addToast(`Exported ${filteredBookings.length} bookings to CSV`, 'success');
  };

  // ==========================================
  // VIEW 1: Loading Auth Verification
  // ==========================================
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center text-white font-sans">
        <div className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-[#1A1A1A] border border-[#D87D38]/30 shadow-2xl">
          <div className="relative w-40 h-12">
            <Image
              src={LOGO_SRC}
              alt="Chutney & Chat"
              fill
              sizes="160px"
              className="object-contain"
              priority
            />
          </div>
          <div className="flex items-center gap-2.5 text-xs text-white/60">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#EE6422]" />
            <span>Verifying administrative session...</span>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: User Redesigned Admin Login
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#111210] text-[#f5f4ee] flex flex-col justify-between font-sans selection:bg-[#ff9a49] selection:text-[#21160c]">
        {/* Header - Brand logo only (Executive portal shape removed as requested) */}
        <header className="h-[90px] sm:h-[112px] max-w-[1440px] w-full mx-auto px-[6%] py-6 sm:py-8 flex items-center justify-between">
          <div className="brand">
            <Link href="/" className="block">
              <Image
                id="logo"
                src={LOGO_SRC}
                alt="Chutney & Chat — Social, Business & Balti"
                width={232}
                height={65}
                className="block w-[180px] sm:w-[232px] h-auto max-h-[65px] object-contain"
                priority
              />
            </Link>
          </div>
        </header>

        {/* Main Content - Centered Card (Left hero column removed as requested) */}
        <main className="max-w-[480px] w-full min-h-[calc(100vh-210px)] mx-auto flex flex-col justify-center px-5 sm:px-6 py-6 sm:py-10 my-auto">
          <section className="bg-[#1b1c19] border border-[#34362f] rounded-[24px] p-7 sm:p-10 shadow-[0_24px_70px_rgba(0,0,0,0.25)] text-left">
            {/* Lock Icon Box */}
            <div className="w-[46px] h-[46px] border border-[#655039] rounded-[13px] grid place-items-center text-[#ff9a49] bg-[#ff9a49]/[0.04]">
              <Lock className="w-5 h-5 stroke-[1.6]" />
            </div>

            {/* Kicker */}
            <p className="mt-7 mb-2 text-[10px] tracking-[2px] text-[#a6aaa0] font-bold uppercase">
              YOUR EVENT WORKSPACE
            </p>

            {/* Title */}
            <h2 className="text-[28px] sm:text-[30px] tracking-[-1px] leading-[1.2] font-normal text-[#f5f4ee] mb-3">
              Welcome back.
            </h2>

            {/* Description */}
            <p className="text-[14px] leading-[1.7] text-[#a6aaa0] mb-[30px]">
              Enter your administrator passcode to manage your next great gathering.
            </p>

            {/* Login Form */}
            <form onSubmit={handleLogin}>
              <div className="flex items-center justify-between mb-2.5">
                <label htmlFor="passcode" className="text-[12px] font-bold text-[#f5f4ee]">
                  Administrator passcode
                </label>
                <span className="text-[10px] text-[#a6aaa0]">Case-sensitive</span>
              </div>

              <div className="flex items-center border border-[#4c4e43] rounded-[10px] bg-[#141511] focus-within:border-[#ff9a49] focus-within:ring-[3px] focus-within:ring-[#ff9a49]/15 transition-all">
                <Lock className="w-[17px] h-[17px] text-[#92978a] ml-4 shrink-0 stroke-[1.6]" />
                <input
                  id="passcode"
                  name="passcode"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your passcode"
                  autoComplete="current-password"
                  required
                  autoFocus
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (authError) setAuthError(null);
                  }}
                  className="w-full bg-transparent border-0 outline-none text-[#f5f4ee] py-4 px-3 text-[14px] placeholder:text-[#85897e]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="w-12 h-[52px] grid place-items-center text-[#b8bbae] hover:text-[#ff9a49] transition-colors shrink-0 cursor-pointer"
                  aria-label={showPassword ? 'Hide passcode' : 'Show passcode'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5 stroke-[1.6]" /> : <Eye className="w-5 h-5 stroke-[1.6]" />}
                </button>
              </div>

              <p className="text-[#a6aaa0] text-[11px] mt-2.5 mb-[23px]">
                Use the passcode provided by your administrator.
              </p>

              {authError && (
                <div className="text-[12px] text-[#ffd1ab] bg-[#ff9a49]/10 border border-[#ff9a49]/30 rounded-lg p-3 mb-4 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-[#ff9a49]" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loggingIn || !passwordInput.trim()}
                className="w-full flex items-center justify-between py-[15px] px-[18px] border border-[#ff9a49] rounded-[10px] bg-[#ff9a49] hover:bg-[#ffae6b] text-[#21160c] font-bold text-[14px] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:translate-y-0 hover:-translate-y-0.5"
              >
                <span>{loggingIn ? 'Accessing dashboard...' : 'Access dashboard'}</span>
                {loggingIn ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-[#21160c]" />
                ) : (
                  <ArrowRight className="w-4 h-4 stroke-[2.2]" />
                )}
              </button>
            </form>

            <p className="mt-[23px] text-center text-[11px] text-[#a6aaa0]">
              Having trouble?{' '}
              <button
                type="button"
                onClick={() => setShowHelpDialog(true)}
                className="text-[#e5e6de] underline underline-offset-[3px] hover:text-[#ff9a49] cursor-pointer"
              >
                Get access help
              </button>
            </p>

            <div className="flex gap-2 items-center justify-center border-t border-[#34362f] mt-[30px] pt-5 text-[10px] text-[#b0b5a6]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>For authorised team members only</span>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="max-w-[1440px] w-full mx-auto px-[6%] py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[#8b9082] text-[10px] border-t border-[#252720]">
          <span>© {new Date().getFullYear()} Chutney &amp; Chat. All rights reserved.</span>
          <span className="tracking-[1px] uppercase">POWERED BY KMG</span>
        </footer>

        {/* Help Dialog Modal */}
        {showHelpDialog && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#1b1c19] border border-[#34362f] rounded-[18px] p-7 max-w-[420px] w-full text-[#f5f4ee] shadow-2xl space-y-3">
              <h3 className="text-lg font-bold text-[#f5f4ee]">Need access?</h3>
              <p className="text-[#a6aaa0] text-sm leading-relaxed">
                Contact your event organiser or administrator to request or reset your passcode.
              </p>
              <div className="pt-2 text-right">
                <button
                  type="button"
                  onClick={() => setShowHelpDialog(false)}
                  className="bg-[#ff9a49] hover:bg-[#ffae6b] text-[#21160c] font-bold text-xs px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // VIEW 3: Executive Admin Dashboard Suite (Chutney Admin Redesign)
  // ==========================================
  const containerClasses = [
    'admin-workspace',
    navPage === 'door' ? 'door-mode' : '',
    navPage === 'guests' ? 'guest-mode' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      {/* Scoped CSS from chutney-admin.html */}
      <style dangerouslySetInnerHTML={{ __html: ADMIN_PORTAL_CSS }} />

      {/* SVG Icon Definitions from chutney-admin.html */}
      <AdminSvgDefs />

      {/* Mobile navigation overlay */}
      <button
        type="button"
        className={`nav-overlay ${mobileMenuOpen ? 'open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-label="Close navigation"
      />

      {/* Fixed Sidebar */}
      <aside className={`sidebar ${mobileMenuOpen ? 'open' : ''}`} id="sidebar">
        <div className="brand">
          <Link href="/" className="block">
            <Image
              src={LOGO_SRC}
              alt="Chutney &amp; Chat"
              width={190}
              height={50}
              className="w-[190px] h-auto object-contain"
              priority
            />
          </Link>
        </div>

        <div className="workspace">
          <div className="mark">
            <AdminIcon name="grid" />
          </div>
          <div>
            <strong>Executive workspace</strong>
            <small>Event administration</small>
          </div>
        </div>

        <div className="nav-label">WORKSPACE</div>

        <nav className="nav" aria-label="Workspace navigation">
          <button
            type="button"
            onClick={() => {
              setNavPage('overview');
              setMobileMenuOpen(false);
            }}
            className={navPage === 'overview' ? 'active' : ''}
            aria-current={navPage === 'overview' ? 'page' : undefined}
          >
            <AdminIcon name="grid" />
            <span>Overview</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setNavPage('guests');
              setMobileMenuOpen(false);
            }}
            className={navPage === 'guests' ? 'active' : ''}
            aria-current={navPage === 'guests' ? 'page' : undefined}
          >
            <AdminIcon name="users" />
            <span>Guest list</span>
            <span className="count">{paidAttendeesTotal}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setNavPage('door');
              setMobileMenuOpen(false);
              setTimeout(() => document.getElementById('search')?.focus(), 50);
            }}
            className={navPage === 'door' ? 'active' : ''}
            aria-current={navPage === 'door' ? 'page' : undefined}
          >
            <AdminIcon name="door" />
            <span>Door mode</span>
          </button>
        </nav>

        <div className="side-note">
          <AdminIcon name="ticket" />
          <h3>
            Good company.
            <br />
            Great gatherings.
          </h3>
          <p>
            A little less admin.
            <br />
            A lot more connection.
          </p>
        </div>

        <div className="account">
          <span className="avatar">AD</span>
          <div>
            <strong>Administrator</strong>
            <small>Executive access</small>
          </div>
        </div>
      </aside>

      {/* Main shell */}
      <div className="shell">
        {/* Topbar */}
        <header className="topbar">
          <button
            type="button"
            className="icon-btn mobile-menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
            aria-expanded={mobileMenuOpen}
          >
            <AdminIcon name="menu" />
          </button>

          <div className="breadcrumbs">
            <span>Workspace</span>
            <span>/</span>
            <strong>
              {navPage === 'door' ? 'Door mode' : navPage === 'guests' ? 'Guest list' : 'Overview'}
            </strong>
          </div>

          <div className="top-right">
            <span className="live-pill">
              <span className="live-dot" />
              LIVE SYNC
            </span>
            <time>{currentDateStr}</time>
            <button
              type="button"
              className="icon-btn"
              onClick={() => fetchBookings(false)}
              aria-label="Sync bookings with Supabase"
              title={lastRefreshed ? `Last synced: ${lastRefreshed.toLocaleTimeString()}` : 'Sync database'}
            >
              <AdminIcon name="refresh" className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              type="button"
              className="icon-btn"
              onClick={handleLogout}
              aria-label="Sign out"
              title="Sign out of admin portal"
            >
              <AdminIcon name="logout" />
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="main">
          {/* Header Title & Actions */}
          <div className="heading">
            <div>
              <p className="eyebrow">CHUTNEY &amp; CHAT · EXECUTIVE SUITE</p>
              <h1>
                {navPage === 'door'
                  ? 'A warm welcome starts here.'
                  : navPage === 'guests'
                  ? 'Your people. All together.'
                  : 'Every detail. One place.'}
              </h1>
              <p className="subtitle">
                {navPage === 'door'
                  ? 'Find a booking, confirm payment, and welcome your guest.'
                  : navPage === 'guests'
                  ? 'Find every booking and keep your guest details close.'
                  : 'A clear view of your events, your guests, and what comes next.'}
              </p>
            </div>
            <div className="actions">
              <button type="button" className="btn" onClick={() => window.print()}>
                <AdminIcon name="print" />
                <span>Print roster</span>
              </button>
              <button type="button" className="btn primary" onClick={exportCSV}>
                <AdminIcon name="download" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Door mode banner */}
          {navPage === 'door' && (
            <div className="door-banner" id="doorBanner">
              <AdminIcon name="door" />
              <p>
                Ready at the door.
                <small>Search by name, email, or ticket reference. Only paid bookings can be checked in.</small>
              </p>
            </div>
          )}

          {/* Metrics Grid */}
          <section className="metrics" aria-label="Event totals">
            <article className="metric">
              <div className="metric-top">
                Gross revenue
                <AdminIcon name="pound" />
              </div>
              <div className="metric-value">{scopedGrossRevenueFormatted}</div>
              <small>
                <strong>Paid orders only</strong> · before fees
              </small>
            </article>

            <article className="metric">
              <div className="metric-top">
                Tickets sold
                <AdminIcon name="ticket" />
              </div>
              <div className="metric-value">{scopedTicketsSold}</div>
              <small>
                {scopedPaidBookings.length} paid order{scopedPaidBookings.length === 1 ? '' : 's'} · {scopedTicketsSold} ticket{scopedTicketsSold === 1 ? '' : 's'} total
              </small>
            </article>

            <article className="metric">
              <div className="metric-top">
                Average order value
                <AdminIcon name="grid" />
              </div>
              <div className="metric-value">{scopedAovFormatted}</div>
              <small>Across confirmed paid orders</small>
            </article>

            <article className="metric">
              <div className="metric-top">
                Business reach
                <AdminIcon name="users" />
              </div>
              <div className="metric-value">{scopedUniqueCompanies}</div>
              <small>Unique businesses · paid bookings</small>
            </article>
          </section>

          {/* Overview Strip: Next Gathering spotlight + Guest arrivals progress */}
          <section className="overview-strip" aria-label="Event spotlight">
            <article className="event-card">
              <div className="date-tile">
                <small>{nextGathering.month}</small>
                <strong>{nextGathering.day}</strong>
              </div>
              <div className="event-copy">
                <p className="eyebrow">NEXT GATHERING · UPCOMING EVENT</p>
                <h2>{nextGathering.title}</h2>
                <p>{nextGathering.fullDate}</p>
              </div>
              <button
                type="button"
                className="icon-btn"
                onClick={handleViewNextEvent}
                aria-label={`View ${nextGathering.title} bookings`}
                title={`Filter bookings for ${nextGathering.title}`}
              >
                <AdminIcon name="arrow" />
              </button>
            </article>

            <article className="progress-card">
              <div className="progress-top">
                <h2>Guest arrivals</h2>
                <span>{scopedCheckInPercentage}% checked in</span>
              </div>
              <div
                className="progress-track"
                role="progressbar"
                aria-label="Paid guests checked in"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={scopedCheckInPercentage}
              >
                <div style={{ width: `${scopedCheckInPercentage}%` }} />
              </div>
              <div className="progress-bottom">
                <span>
                  <strong>{scopedArrivals}</strong> checked in
                </span>
                <span>
                  <strong>{Math.max(0, scopedTicketsSold - scopedArrivals)}</strong> still to arrive
                </span>
              </div>
            </article>
          </section>

          {/* Guest List Roster Section */}
          <section className="roster" aria-labelledby="rosterTitle">
            <div className="roster-title">
              <div>
                <h2 id="rosterTitle">The guest list</h2>
                <p>Your bookings, from first hello to final check-in.</p>
              </div>
              <div className="view-switch" aria-label="Display style">
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={viewMode === 'table' ? 'active' : ''}
                  aria-pressed={viewMode === 'table'}
                >
                  <AdminIcon name="list" />
                  <span>Table</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('cards')}
                  className={viewMode === 'cards' ? 'active' : ''}
                  aria-pressed={viewMode === 'cards'}
                >
                  <AdminIcon name="grid" />
                  <span>Cards</span>
                </button>
              </div>
            </div>

            <div className="toolbar">
              <label className="search" htmlFor="search">
                <AdminIcon name="search" />
                <input
                  id="search"
                  type="search"
                  aria-label="Search guests"
                  placeholder="Search name, email, company or ticket…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <kbd>/</kbd>
              </label>

              <select
                id="eventFilter"
                aria-label="Filter by event"
                value={eventFilter}
                onChange={(e) => setEventFilter(e.target.value)}
              >
                <option value="all">All events</option>
                {availableEvents.map((evt) => (
                  <option key={evt} value={evt}>
                    {evt}
                  </option>
                ))}
              </select>

              <select
                className="sort"
                id="sort"
                aria-label="Sort bookings"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'new' | 'name' | 'amount')}
              >
                <option value="new">Newest first</option>
                <option value="name">Name A–Z</option>
                <option value="amount">Highest amount</option>
              </select>
            </div>

            <div className="tabs" role="group" aria-label="Filter by booking status">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={statusFilter === 'all' ? 'active' : ''}
                aria-pressed={statusFilter === 'all'}
              >
                All bookings
                <span>{scopedBookings.length}</span>
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('paid')}
                className={statusFilter === 'paid' ? 'active' : ''}
                aria-pressed={statusFilter === 'paid'}
              >
                Paid
                <span>{scopedPaidBookings.length}</span>
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('pending')}
                className={statusFilter === 'pending' ? 'active' : ''}
                aria-pressed={statusFilter === 'pending'}
              >
                Pending
                <span>{scopedPendingBookings.length}</span>
              </button>
            </div>

            {/* Table View */}
            {viewMode === 'table' && filteredBookings.length > 0 && (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th scope="col">ATTENDEE</th>
                      <th scope="col">EVENT / TICKET</th>
                      <th className="company-col" scope="col">COMPANY</th>
                      <th scope="col">AMOUNT</th>
                      <th scope="col">STATUS</th>
                      <th scope="col">CHECK-IN</th>
                      <th scope="col"><span aria-label="Details">↗</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((b) => {
                      const isPaid = b.status === 'paid';
                      const isCheckedIn = checkedInIds.has(b.id);
                      const avatarStyle = getAvatarStyle(b.name);

                      return (
                        <tr key={b.id}>
                          <td>
                            <div className="person">
                              <span className="avatar" style={{ background: avatarStyle.bg, color: avatarStyle.text }}>
                                {getInitials(b.name)}
                              </span>
                              <div>
                                <strong>{b.name}</strong>
                                <small>{b.email}</small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="event-name">{b.eventTitle}</span>
                            <span className="ref">{b.ticketNumber}</span>
                          </td>
                          <td className="company-col">{b.company || 'Private attendee'}</td>
                          <td className="amount">{b.amountFormatted}</td>
                          <td>
                            <span className={`status ${isPaid ? '' : 'pending'}`}>
                              {isPaid ? 'Paid' : 'Pending'}
                            </span>
                          </td>
                          <td>
                            <button
                              type="button"
                              className={`check-btn ${isCheckedIn ? 'done' : ''}`}
                              disabled={!isPaid}
                              onClick={() => toggleCheckIn(b.id, b.name)}
                              aria-label={`${isCheckedIn ? 'Undo check-in for' : 'Check in'} ${b.name}`}
                              title={!isPaid ? 'Payment required before check-in' : undefined}
                            >
                              {isCheckedIn && <AdminIcon name="check" />}
                              {!isPaid ? 'Unpaid' : isCheckedIn ? 'Checked in' : 'Check in'}
                            </button>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="detail-btn"
                              onClick={() => setSelectedBooking(b)}
                              aria-label={`View ${b.name} booking`}
                            >
                              <AdminIcon name="arrow" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Cards View */}
            {viewMode === 'cards' && filteredBookings.length > 0 && (
              <div className="cards">
                {filteredBookings.map((b) => {
                  const isPaid = b.status === 'paid';
                  const isCheckedIn = checkedInIds.has(b.id);
                  const avatarStyle = getAvatarStyle(b.name);

                  return (
                    <article key={b.id} className="guest-card">
                      <div className="person">
                        <span className="avatar" style={{ background: avatarStyle.bg, color: avatarStyle.text }}>
                          {getInitials(b.name)}
                        </span>
                        <div>
                          <strong>{b.name}</strong>
                          <small>{b.email}</small>
                        </div>
                      </div>
                      <span className="event-name">{b.eventTitle}</span>
                      <span className="ref">{b.ticketNumber} · {b.company || 'Private attendee'}</span>
                      <div className="card-meta">
                        <span className={`status ${isPaid ? '' : 'pending'}`}>
                          {isPaid ? 'Paid' : 'Pending'}
                        </span>
                        <span className="amount">{b.amountFormatted}</span>
                      </div>
                      <footer>
                        <button
                          type="button"
                          className={`check-btn ${isCheckedIn ? 'done' : ''}`}
                          disabled={!isPaid}
                          onClick={() => toggleCheckIn(b.id, b.name)}
                          aria-label={`${isCheckedIn ? 'Undo check-in for' : 'Check in'} ${b.name}`}
                          title={!isPaid ? 'Payment required before check-in' : undefined}
                        >
                          {isCheckedIn && <AdminIcon name="check" />}
                          {!isPaid ? 'Unpaid' : isCheckedIn ? 'Checked in' : 'Check in'}
                        </button>
                        <button
                          type="button"
                          className="detail-btn"
                          onClick={() => setSelectedBooking(b)}
                          aria-label={`View ${b.name} booking`}
                        >
                          <AdminIcon name="arrow" />
                        </button>
                      </footer>
                    </article>
                  );
                })}
              </div>
            )}

            {/* Empty State */}
            {filteredBookings.length === 0 && (
              <div className="empty">
                <h3>No guests found</h3>
                <p>Try another name or clear your filters.</p>
                <button type="button" className="btn" onClick={clearFilters}>
                  Clear filters
                </button>
              </div>
            )}

            {/* Roster Footer */}
            <div className="table-footer">
              <span role="status" aria-live="polite">
                Showing <strong>{filteredBookings.length}</strong> of <strong>{scopedBookings.length}</strong> bookings
              </span>
              <span>
                <strong>{scopedArrivals} of {scopedTicketsSold}</strong> paid guests checked in
              </span>
            </div>
          </section>

          {/* Page Footer */}
          <footer className="bottom">
            <span><b>Chutney &amp; Chat</b> · Thoughtfully brought together.</span>
            <span>Connected to Supabase live database · Powered by KMG</span>
          </footer>
        </main>
      </div>

      {/* Slide-out Booking Details Drawer */}
      {selectedBooking && (
        <>
          <div
            className="drawer-backdrop"
            onClick={() => setSelectedBooking(null)}
            aria-label="Close drawer overlay"
          />
          <aside className="drawer-panel" aria-label="Booking details">
            <div className="drawer-top">
              <span>BOOKING DETAILS</span>
              <button
                type="button"
                className="icon-btn"
                onClick={() => setSelectedBooking(null)}
                aria-label="Close details"
              >
                <AdminIcon name="close" />
              </button>
            </div>

            <div className="drawer-body">
              <div
                className="avatar"
                style={{
                  background: getAvatarStyle(selectedBooking.name).bg,
                  color: getAvatarStyle(selectedBooking.name).text,
                }}
              >
                {getInitials(selectedBooking.name)}
              </div>
              <h2>{selectedBooking.name}</h2>
              <p>{selectedBooking.email}</p>

              <span className={`status ${selectedBooking.status === 'paid' ? '' : 'pending'}`}>
                {selectedBooking.status === 'paid' ? 'Paid' : 'Pending'}
              </span>

              <h3>EVENT &amp; BOOKING</h3>
              <dl>
                <div>
                  <dt>Event</dt>
                  <dd>{selectedBooking.eventTitle}</dd>
                </div>
                <div>
                  <dt>Venue</dt>
                  <dd>{selectedBooking.eventVenue || 'Tipu Sultan, Leicester'}</dd>
                </div>
                <div>
                  <dt>Date &amp; Time</dt>
                  <dd>{formatDate(selectedBooking.eventDate)}</dd>
                </div>
                <div>
                  <dt>Ticket reference</dt>
                  <dd style={{ fontFamily: 'ui-monospace, monospace' }}>{selectedBooking.ticketNumber}</dd>
                </div>
                <div>
                  <dt>Company</dt>
                  <dd>{selectedBooking.company || 'Private attendee'}</dd>
                </div>
                {selectedBooking.role && (
                  <div>
                    <dt>Job Title / Role</dt>
                    <dd>{selectedBooking.role}</dd>
                  </div>
                )}
                {selectedBooking.phone && (
                  <div>
                    <dt>Phone number</dt>
                    <dd>{selectedBooking.phone}</dd>
                  </div>
                )}
                <div>
                  <dt>Tickets</dt>
                  <dd>{selectedBooking.quantity} admission{selectedBooking.quantity > 1 ? 's' : ''}</dd>
                </div>
                <div>
                  <dt>Order total</dt>
                  <dd>{selectedBooking.amountFormatted}</dd>
                </div>
                {selectedBooking.stripePaymentIntentId && (
                  <div>
                    <dt>Stripe Payment</dt>
                    <dd style={{ fontFamily: 'ui-monospace, monospace', fontSize: '10px' }}>
                      {selectedBooking.stripePaymentIntentId}
                    </dd>
                  </div>
                )}
                <div>
                  <dt>Door check-in</dt>
                  <dd>{checkedInIds.has(selectedBooking.id) ? 'Checked in' : 'Not checked in'}</dd>
                </div>
              </dl>

              {/* Multi-guest breakdown if available */}
              {selectedBooking.guestDetails && selectedBooking.guestDetails.length > 0 && (
                <div style={{ marginTop: '24px' }}>
                  <h3>REGISTERED GUESTS ({selectedBooking.guestDetails.length})</h3>
                  <div style={{ display: 'grid', gap: '8px', marginTop: '10px' }}>
                    {selectedBooking.guestDetails.map((g, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '10px 12px',
                          border: '1px solid var(--border)',
                          borderRadius: '8px',
                          background: '#fff',
                          fontSize: '11px',
                        }}
                      >
                        <strong>{g.name || `Guest #${idx + 1}`}</strong>
                        <div style={{ color: 'var(--muted)', fontSize: '10px', marginTop: '2px' }}>
                          {g.email} {g.company ? `· ${g.company}` : ''} {g.role ? `(${g.role})` : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="button"
                className={`btn ${selectedBooking.status === 'paid' ? 'primary' : ''} drawer-check-btn`}
                disabled={selectedBooking.status !== 'paid'}
                onClick={() => toggleCheckIn(selectedBooking.id, selectedBooking.name)}
              >
                {selectedBooking.status === 'paid'
                  ? checkedInIds.has(selectedBooking.id)
                    ? 'Undo check-in'
                    : 'Check in guest'
                  : 'Payment required before check-in'}
              </button>

              {selectedBooking.status === 'paid' && (
                <button
                  type="button"
                  className="btn drawer-pdf-btn"
                  disabled={generatingPdfId === selectedBooking.id}
                  onClick={() => handleDownloadPDF(selectedBooking)}
                >
                  <AdminIcon name="download" />
                  <span>
                    {generatingPdfId === selectedBooking.id
                      ? 'Generating PDF ticket...'
                      : 'Download Official PDF Ticket'}
                  </span>
                </button>
              )}

              <p className="drawer-note">
                Live booking record from Supabase database.
              </p>
            </div>
          </aside>
        </>
      )}

      {/* Floating System Toast */}
      {toasts.length > 0 && (
        <div className="toast" role="status">
          {toasts[toasts.length - 1].message}
        </div>
      )}
    </div>
  );
}
