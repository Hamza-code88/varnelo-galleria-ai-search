import { NextResponse } from 'next/server';
import { algoliasearch } from 'algoliasearch';
import { localDemoState } from '@/lib/search-client';

const APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
const ADMIN_KEY = process.env.ALGOLIA_ADMIN_KEY;
const INDEX_NAME = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || 'varnelo_products';

const isLiveAlgolia = Boolean(
  APP_ID &&
  ADMIN_KEY &&
  APP_ID !== 'your_app_id' &&
  ADMIN_KEY !== 'your_admin_api_key'
);

export async function GET() {
  if (!isLiveAlgolia) {
    return NextResponse.json({
      success: true,
      mock: true,
      pinHighMargin: localDemoState.pinHighMargin,
      demoteOOS: localDemoState.demoteOOS,
      synonyms: localDemoState.synonyms,
    });
  }

  try {
    const client = algoliasearch(APP_ID!, ADMIN_KEY!);
    const [settings, synRes] = await Promise.all([
      client.getSettings({ indexName: INDEX_NAME }),
      client.searchSynonyms({ indexName: INDEX_NAME }),
    ]);

    const customRanking = settings.customRanking || [];
    return NextResponse.json({
      success: true,
      mock: false,
      pinHighMargin: customRanking.includes('desc(is_pinned)'),
      demoteOOS: customRanking.includes('desc(in_stock)'),
      synonyms: (synRes.hits || []).map((s: any) => ({
        objectID: s.objectID,
        synonyms: s.synonyms || [],
      })),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to load merchandising state' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const startTime = Date.now();
  try {
    const body = await req.json();
    const { action, payload } = body;

    if (!isLiveAlgolia) {
      // Update local demo state so InstantSearch refresh() reflects changes immediately
      if (action === 'updateRanking') {
        localDemoState.pinHighMargin = Boolean(payload.pinHighMargin);
        localDemoState.demoteOOS = Boolean(payload.demoteOOS);
      } else if (action === 'togglePinProduct') {
        if (payload.isPinned) {
          localDemoState.pinnedIds.add(payload.objectID);
        } else {
          localDemoState.pinnedIds.delete(payload.objectID);
        }
      } else if (action === 'addSynonym') {
        localDemoState.synonyms.push({
          objectID: `syn-${Date.now()}`,
          synonyms: [payload.termA.trim(), payload.termB.trim()],
        });
      } else if (action === 'deleteSynonym') {
        localDemoState.synonyms = localDemoState.synonyms.filter(
          (s) => s.objectID !== payload.synonymId
        );
      }

      const latencyMs = Math.max(8, Date.now() - startTime + 11);
      return NextResponse.json({
        success: true,
        mock: true,
        latencyMs,
        message: `Applied in ${latencyMs}ms`,
      });
    }

    const client = algoliasearch(APP_ID!, ADMIN_KEY!);

    if (action === 'updateRanking') {
      const { pinHighMargin, demoteOOS } = payload;
      const ranking: string[] = [];
      if (pinHighMargin) ranking.push('desc(is_pinned)');
      if (demoteOOS) ranking.push('desc(in_stock)');
      ranking.push('desc(margin_score)');

      await client.setSettings({
        indexName: INDEX_NAME,
        indexSettings: {
          customRanking: ranking,
        },
      });
    } else if (action === 'togglePinProduct') {
      const { objectID, isPinned } = payload;
      await client.partialUpdateObject({
        indexName: INDEX_NAME,
        objectID,
        attributesToUpdate: {
          is_pinned: isPinned,
        },
      });
    } else if (action === 'addSynonym') {
      const { termA, termB } = payload;
      const synonymId = `syn-${Date.now()}`;
      await client.saveSynonym({
        indexName: INDEX_NAME,
        objectID: synonymId,
        synonymHit: {
          objectID: synonymId,
          type: 'synonym',
          synonyms: [termA.trim(), termB.trim()],
        },
      });
    } else if (action === 'deleteSynonym') {
      const { synonymId } = payload;
      await client.deleteSynonym({
        indexName: INDEX_NAME,
        objectID: synonymId,
      });
    }

    const latencyMs = Date.now() - startTime;
    return NextResponse.json({
      success: true,
      mock: false,
      latencyMs,
      message: `Applied in ${latencyMs}ms`,
    });
  } catch (error: any) {
    console.error('Merchandising API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update merchandising' },
      { status: 500 }
    );
  }
}
